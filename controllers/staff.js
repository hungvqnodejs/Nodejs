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
  const user = await User.findById("6215385dc20b2a08e7b89e14");
  res.render("staff", { pageTitle: "Nhân viên", user: user });
};

exports.getStaffRollcall = async (req, res) => {
  const user = await User.findById("6215385dc20b2a08e7b89e14");
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
    endTime: "",
    userId: "6215385dc20b2a08e7b89e14",
  });
  rollcall
    .save()
    .then((result) => {
      console.log(result);
      res.redirect(`staff-rollcall/${result._id}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getStaffEnd = async (req, res) => {
  const user = await User.findById("6215385dc20b2a08e7b89e14");
  const rollcall = await Rollcall.find();
  var i = 0;
  var timework = 0;
  for (i = 0; i < rollcall.length; i++) {
    timework +=
      (Date.parse(rollcall[i].endTime) - Date.parse(rollcall[i].startTime)) /
      1000;
  }

  res.render("staff-end", {
    pageTitle: "Kết thúc",
    rollcall: rollcall,
    user: user,
    timework,
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
      console.log(err);
    });
};

// Hàm tình giờ ( thời gian kết thúc - thời gian bắt đầu)
function diff_hours(dt2, dt1) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60 * 60;
  return Math.abs(Math.round(diff));
}

exports.getStaffLeave = async (req, res) => {
  const user = await User.findById("6215385dc20b2a08e7b89e14");
  const annualLeave = await AnnualLeave.find();

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
  const user = await User.findById("6215385dc20b2a08e7b89e14");
  let totalTime = diff_hours(endLeave, startLeave);

  if (totalTime < 24) {
    totalTime = totalTime / 8;
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

    User.findById("6215385dc20b2a08e7b89e14")
      .then((user) => {
        user.annualLeave = leaveLeft;
        console.log(user);
        return user.save();
      })
      .catch((err) => {
        console.log(err);
      });

    const annualLeave = new AnnualLeave({
      startLeave: startLeave,
      endLeave: endLeave,
      totalTime,
      reason: req.body.reason,
      userId: "6215385dc20b2a08e7b89e14",
    });
    annualLeave
      .save()
      .then((result) => {
        console.log(result);
        res.redirect("staff-leave");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.getInfo = async (req, res) => {
  const user = await User.findById("6215385dc20b2a08e7b89e14");
  res.render("info", { pageTitle: "Thông tin cá nhân", user: user });
};

exports.postInfo = async (req, res) => {
  const Image = req.body.image;
  User.findById("6215385dc20b2a08e7b89e14")
    .then((user) => {
      user.Image = Image;
      console.log(user);
      return user.save();
    })
    .then((result) => {
      res.redirect("/info");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getWork = async (req, res) => {
  const user = await User.findById("6215385dc20b2a08e7b89e14");
  const rollcall = await Rollcall.find();

  res.render("work", {
    pageTitle: "Thông tin công việc",
    user: user,
    rollcall: rollcall,
  });
};

exports.getCovid = async (req, res) => {
  const user = await User.findById("6215385dc20b2a08e7b89e14");
  const bodyTemperature = await BodyTemperature.find();
  const covid = await Covid.find();
  const existsVaccine = await Vaccine.findOne({ injection: "mui1" });
  const existsVaccine2 = await Vaccine.findOne({ injection: "mui2" });
  let disabledVaccine = null;
  let disabledVaccine2 = null;
  if (existsVaccine) {
    if (existsVaccine.injection === "mui1") {
      disabledVaccine = "disabled";
    }
  }
  if (existsVaccine2) {
    if (existsVaccine2.injection === "mui2") {
      disabledVaccine2 = "disabled";
    }
  }

  res.render("covid", {
    pageTitle: "Thông tin Covid cá nhân",
    user: user,
    bodyTemperature: bodyTemperature,
    covid: covid,
    disabledVaccine: disabledVaccine,
    disabledVaccine2: disabledVaccine2,
  });
};

exports.postCovid = async (req, res) => {
  if (typeof req.body.measureDay !== "undefined") {
    const bodyTemperature = new BodyTemperature({
      measureDay: req.body.measureDay,
      temperature: req.body.temperature,
      userId: "6215385dc20b2a08e7b89e14",
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
      userId: "6215385dc20b2a08e7b89e14",
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
      userId: "6215385dc20b2a08e7b89e14",
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
