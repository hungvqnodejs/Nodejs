const Rollcall = require("../models/rollcall");
const User = require("../models/user");
const AnnualLeave = require("../models/annualLeave");
const BodyTemperature = require("../models/bodyTemperature");
const Vaccine = require("../models/vaccine");
const Covid = require("../models/covid");


exports.getAdmin = async (req, res) => {
    const user = await User.findById(req.session.user._id)
    res.render("admin", { pageTitle: "Quuản lý giờ làm", user: user});
  };