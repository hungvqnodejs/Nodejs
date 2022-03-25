const Rollcall = require("../models/rollcall");
const User = require("../models/user");

exports.getAdmin = async (req, res) => {
  const user = await User.findById(req.session.user._id);
  const rollcall = await Rollcall.find({ userId: req.query.idStaff });
  const users = await User.find({ department: { $ne: "MGR" } });
  res.render("admin", {
    pageTitle: "Quuản lý giờ làm",
    user: user,
    users: users,
    rollcall: rollcall,
  });
};

exports.postDeleteAdmin = async (req, res, next) => {
  Rollcall.findById(req.params.rollcallId)
    .then((rollcall) => {
      rollcall.endTime = req.body.endTime;
      return rollcall.save();
    })
    .then((result) => {
      res.redirect("/admin");
    })
    .catch((err) => {
      console.log(err);
    });
};
