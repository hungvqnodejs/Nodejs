const User = require("../models/user");

exports.getLogin = async (req, res) => {
  let message = req.flash('error')
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
  res.render("auth/login", { pageTitle: "Login", errorMessage: message });
};

exports.postLogin = async (req, res) => {
  const { account, password } = req.body;

  User.findOne({
    account: account, password: password
  })
    .then(user => {
      if (!user) {
        req.flash('error', 'Tài khoàn hoặc mật khẩu không đúng')
        return res.redirect('/login')
      }
        req.session.isLoggedIn = true
        req.session.user = user
        return req.session.save(err => {
          res.redirect('/')
        })
    })
    .catch(err => console.log(err));
};

exports.postLogout = async (req, res) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/login");
  });
};
