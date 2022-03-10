exports.getLogin = async (req, res) => {
  res.render("auth/login", { pageTitle: "Login" });
};
