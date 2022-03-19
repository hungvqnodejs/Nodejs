const User = require("../models/user");

const isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
}

const isAdmin = (req, res, next) => {
    User.findById(req.session.user._id)
     if (req.session.user.department !== "MGR") {
         return res.redirect('/500');
     }
    next();
}

module.exports = {isAuth, isAdmin }