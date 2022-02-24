const Rollcall = require("../models/rollcall");
const User = require("../models/user");

exports.homepage = async (req, res) => {
  res.render("index", { pageTitle: "Trang chủ" });
};

exports.getStaff = async (req, res) => {
  const user = await User.findById("6215385dc20b2a08e7b89e14");
  res.render("staff", { pageTitle: "Nhân viên", user: user });
};

exports.getStaffRollcall = async (req, res) => {
  const rollcall = await Rollcall.findById(req.params.rollcallId);
  res.render("staff-rollcall", { pageTitle: "Điểm danh", rollcall: rollcall });

};

exports.postStaffRollcall = async (req, res) => {
  const startTime = new Date();
  const rollcall = new Rollcall({
    workplace: req.body.workplace,
    startTime: startTime,
    endTime: '',
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
    const rollcall = await Rollcall.find();
    // if ( rollcall.length > 0) {
    //     for (i of rollcall ) {
    //         const timeWork = (rollcall[i].endTime.getTime() - rollcall[i].startTime.getTime())/1000
    //         console.log('ok', timeWork)
    //     }   
    // }
    
    res.render("staff-end", { pageTitle: "Kết thúc", rollcall: rollcall });
};

exports.postStaffEnd = async(req, res) => {
 const rollcall = await Rollcall.findById(req.params.rollcallId);
  const workplace = rollcall.workplace;
  const startTime = rollcall.startTime;
  const endTime = new Date()
  Rollcall.findById(req.params.rollcallId)
          .then(rollcall => {
              rollcall.workplace = workplace,
              rollcall.startTime = startTime,
              rollcall.endTime = endTime
              return rollcall.save()
          })
          .then(() => res.redirect("/staff-end"))
          .catch(err => {
              console.log(err)
          })
};

exports.getStaffLeave = async (req, res) => {
  res.render("staff-leave", { pageTitle: "Nghỉ Phép" });
};


exports.getInfo = async(req, res) => {
    const user = await User.findById("6215385dc20b2a08e7b89e14");
    res.render("info", { pageTitle: "Thông tin cá nhân", user: user });
}

exports.postInfo = async(req, res) => {
    const user = await User.findById("6215385dc20b2a08e7b89e14");
    const Image = user.Image
    User.findById("6215385dc20b2a08e7b89e14")
        .then(user => {
            user.Image = Image
            console.log(user)
            return user.save()
           
        })
        .then(result => {
            res.redirect("/info")
        })
        .catch(err => {
            console.log(err)
        })
}