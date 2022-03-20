const Rollcall = require("../models/rollcall");
const User = require("../models/user");
const AnnualLeave = require("../models/annualLeave");
const BodyTemperature = require("../models/bodyTemperature");
const Vaccine = require("../models/vaccine");
const Covid = require("../models/covid");


exports.getAdmin = async (req, res) => {
    const user = await User.findById(req.session.user._id)
    const rollcall = await Rollcall.find({userId: req.query.idStaff });
    const users = await User.find({department: { $ne: 'MGR' } });  
    res.render("admin", { pageTitle: "Quuản lý giờ làm", user: user, users: users, rollcall: rollcall});
  };

  exports.postDeleteAdmin = (req, res, next) => {
    const endTimeId = req.body.endTimeId;
    Rollcall.remove({endTimeId}).then(() => {
      res.redirect('/admin');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  };  