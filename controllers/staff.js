const fs = require('fs')
const path = require('path')
const PDFDoc = require('pdfkit')

const Rollcall = require("../models/rollcall");
const User = require("../models/user");
const AnnualLeave = require("../models/annualLeave");
const BodyTemperature = require("../models/bodyTemperature");
const Vaccine = require("../models/vaccine");
const Covid = require("../models/covid");
const moment = require("moment");

exports.homepage = async (req, res) => {
  res.render("index", { pageTitle: "Trang chủ" });
};

exports.getStaff = async (req, res) => {
  const user = await User.findById(req.session.user._id)
  res.render("staff", { pageTitle: "Nhân viên", user: user });
};

exports.getStaffRollcall = async (req, res) => {
  const user = await User.findById(req.session.user._id)
  const rollcall = await Rollcall.findById(req.params.rollcallId);
  res.render("staff-rollcall", {
    pageTitle: "Điểm danh",
    rollcall: rollcall,
    user: user,

  });
};

exports.postStaffRollcall = async (req, res) => {
  const startTime = new Date();
  const rollcall = new Rollcall({
    workplace: req.body.workplace,
    startTime: startTime,
    endTime: null,
    userId: req.session.user
  });
  rollcall
    .save()
    .then((result) => {
      res.redirect(`staff-rollcall/${result._id}`);
    })
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500;
      console.log(err)
      return next(error)
      
    });
};

// Hàm tình giờ ( thời gian kết thúc - thời gian bắt đầu)
function diff_hours(dt2, dt1) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60 * 60;
  return Math.abs(diff).toFixed(1);
}

exports.getStaffEnd = async (req, res) => {
  const user = await User.findById(req.session.user._id)
  const rollcall = await Rollcall.find({userId: req.session.user._id});

  var i = 0;
  var totaltimework = 0;
  for (i = 0; i < rollcall.length; i++) {
    totaltimework +=
      rollcall[i].timework
  }

  res.render("staff-end", {
    pageTitle: "Kết thúc",
    rollcall: rollcall,
    user: user,
    totaltimework,

  });
};

exports.postStaffEnd = async (req, res) => {
  const rollcall = await Rollcall.findById(req.params.rollcallId);
  const workplace = rollcall.workplace;
  const startTime = rollcall.startTime;
  const endTime = new Date();
  let timework = diff_hours(endTime, startTime);
  Rollcall.findById(req.params.rollcallId)
    .then((rollcall) => {
      (rollcall.workplace = workplace),
        (rollcall.startTime = startTime),
        (rollcall.endTime = endTime),
        (rollcall.timework = timework);
      return rollcall.save();
    })
    .then(() => res.redirect("/staff-end"))
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500;
      console.log(err)
      return next(error)
    });
};

exports.getStaffLeave = async (req, res) => {
  const user = await User.findById(req.session.user._id)

  const annualLeave = await AnnualLeave.find({userId: req.session.user._id});
  const totalTime = annualLeave
    .map((item) => item.totalTime)
    .reduce((prev, curr) => prev + curr, 0);

  res.render("staff-leave", {
    pageTitle: "Nghỉ Phép",
    user: user,
    totalTime: totalTime,
    error: "",

  });
};

exports.postStaffLeave = async (req, res) => {
  const startLeave = moment(req.body.startLeave, "hh:mm DD/MM/YYYY").toDate();
  const endLeave = moment(req.body.endLeave, "hh:mm DD/MM/YYYY").toDate();
  const user = await User.findById(req.session.user._id)
  let totalTime = diff_hours(endLeave, startLeave); // số giờ xin nghỉ phép

  if(totalTime <= 8){  
    totalTime = totalTime / 8 
  } else if(totalTime > 8 && totalTime <= 24) {
    totalTime = 1;
  } else {
    totalTime = totalTime / 24;
  }

  let message = "";
  if (totalTime > user.annualLeave) {
    message = "Đã vượt quá số ngày nghỉ phép";
    res.render("staff-leave", {
      pageTitle: "Nghỉ Phép",
      user: user,
      totalTime: totalTime,
      error: message,
    });
  } else {
    const leaveLeft = user.annualLeave - totalTime;

    User.findById(req.session.user._id)
      .then((user) => {
        user.annualLeave = leaveLeft;
        return user.save();
      })
      .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500;
        console.log(err)
        return next(error)
      });

    const annualLeave = new AnnualLeave({
      startLeave: startLeave,
      endLeave: endLeave,
      totalTime,
      reason: req.body.reason,
      userId: req.session.user,
    });
    annualLeave
      .save()
      .then((result) => {
        console.log(result);
        res.redirect("staff-leave");
      })
      .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500;
        console.log(err)
        return next(error)
      });
  }
};

exports.getInfo = async (req, res) => {
  const user = await User.findById(req.session.user._id)
  res.render("info", { pageTitle: "Thông tin cá nhân", user: user });
};

exports.postInfo = async (req, res) => {
  const image = req.file
  User.findById(req.session.user._id)
    .then((user) => {
      if(image){
        user.image = image.path;
      }    
      console.log(user.image)
      return user.save();
    })
    .then((result) => {
      res.redirect("/info");
    })
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500;
      console.log(err)
      return next(error)
    });
};

const ITEMS_PER_PAGE = 3

exports.getWork = async (req, res) => {
  const user = await User.findById(req.session.user._id)
  const rollcall = await Rollcall.find({userId: req.session.user._id});

  // Số giờ đã làm trong ngày
  var i = 0;
  var totaltimework = 0;
  for (i = 0; i < rollcall.length; i++) {
    totaltimework +=
      rollcall[i].timework
  }

  const overTime =  totaltimework - 8 // Số giờ tăng ca hoặc thiếu giờ làm

 const salary = user.salaryScale*3000000 + overTime*200000

 const page = + req.query.page || 1
 let totalItems

  // search
  const k = req.query.k

  if (req.query.search) {    
      Rollcall.find({
        [k] : req.query.search
      }).then((rollcall) => {
        res.render("work", {
          pageTitle: "Thông tin công việc",
          user: user,
          rollcall: rollcall,
          salary,     
        });
      });    
  } else {
    Rollcall.find({userId: req.session.user._id})
      .countDocuments()
      .then(numberRollcall => {
        totalItems = numberRollcall
        return Rollcall.find({userId: req.session.user._id})
                .skip((page -1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
      })
      .then((rollcall) => {
      res.render("work", {
        pageTitle: "Thông tin công việc",
        user: user,
        rollcall: rollcall,
        salary,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
  }  
};

exports.getCovid = async (req, res) => {

  const currentUser = await User.findById(req.query.idStaff);
  const user = await User.findById(req.session.user._id)
  const bodyTemperature = await BodyTemperature.find({userId: req.session.user._id});
  const covid = await Covid.find({userId: req.session.user._id});
  const vaccine = await Vaccine.find({userId: req.session.user._id});

  const users= await User.find({department: { $ne: 'MGR' } });
  const bodyTemperatureAdmin = await BodyTemperature.find({userId: req.query.idStaff });
  const covidAdmin = await Covid.find({userId: req.query.idStaff });
  const vaccineAdmin = await Vaccine.find({userId: req.query.idStaff });

  

  // Điều kiện chọn mũi 1 - mũi 2
  const existsVaccine = await Vaccine.findOne({ userId: req.session.user._id, injection: "Mũi 1" });
  const existsVaccine2 = await Vaccine.findOne({ userId: req.session.user._id, injection: "Mũi 2" });
  let disabledVaccine = null;
  let disabledVaccine2 = null;
  if (existsVaccine) {
    if (existsVaccine.injection === "Mũi 1") {
      disabledVaccine = "disabled";
    }
  }
  if (existsVaccine2) {
    if (existsVaccine2.injection === "Mũi 2") {
      disabledVaccine2 = "disabled";
    }
  }
  res.render("covid", {
    pageTitle: "Thông tin Covid cá nhân",
    user: user,
    users: users,
    currentUser: currentUser,
    bodyTemperature: bodyTemperature,
    covid: covid,
    vaccine: vaccine,
    bodyTemperatureAdmin: bodyTemperatureAdmin,
    covidAdmin: covidAdmin,
    vaccineAdmin: vaccineAdmin,
    disabledVaccine: disabledVaccine,
    disabledVaccine2: disabledVaccine2,
    isAdmin: req.session.user.department
  });
};

exports.postCovid = async (req, res) => {
  if (typeof req.body.measureDay !== "undefined") {
    const bodyTemperature = new BodyTemperature({
      measureDay: req.body.measureDay,
      temperature: req.body.temperature,
      userId: req.session.user
    });
    bodyTemperature
      .save()
      .then((result) => {
        res.redirect("/covid");
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (typeof req.body.injection !== "undefined") {
    const vaccineDay = moment(req.body.vaccineDay, "HH:mm DD/MM/YYYY").toDate();
    const vaccine = new Vaccine({
      injection: req.body.injection,
      vaccineType: req.body.vaccineType,
      vaccineDay: vaccineDay,
      userId: req.session.user._id
    });
    vaccine
      .save()
      .then((result) => {
        res.redirect("/covid");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    const covid = new Covid({
      arrive: req.body.arrive,
      symptom: req.body.symptom,
      contact: req.body.contact,
      userId:  req.session.user._id
    });
    covid
      .save()
      .then((result) => {
        res.redirect("/covid");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.getPDFCovid = async (req, res) => {
  console.log('ok');
  // const CovidId = req.params.covidId
  // const pdfCovidName = 'pdfcovid-' + CovidId + '.pdf'
  const pdfCovidPath = path.join('public','assets', 'test.pdf');
  console.log(pdfCovidPath);
  
  fs.readFile(pdfCovidPath, (err, data) => {
    if(err) {
      return next(err)
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.send(data)
  })
};