const user = require("../models/user");

const isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
}

const isAdmin = (req, res, next) => {
    if (user.department !== "MGR") {
        return res.redirect('/500');
    }
    next();
}

module.exports = {isAuth, isAdmin }