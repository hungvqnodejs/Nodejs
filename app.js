const path = require("path");

const express = require("express");
// const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const flash = require('connect-flash')

const routes = require("./routes/staff");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");

const User = require("./models/user");

const MONGODB_URI =
  "mongodb+srv://hungvq:Pass1@cluster0.mzvgb.mongodb.net/Staff2?retryWrites=true&w=majority";

const app = express();
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(flash())
app.use(authRoutes);
app.use("/", routes);
app.get('/500', errorController.get500)
app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Error', isAuthenticated: req.session.isLoggedIn
  });
})

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next()
      }
      req.user = user;
      next();
    })
    .catch((err) => {next(new Error(err))});
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    // User.findOne().then(user => {
    //     if(!user) {
    //         const user = new User({
    //             name: 'Ken',
    //             doB: new Date("1993-04-08"),
    //             salaryScale: 1,
    //             startDate: new Date("2022-02-12"),
    //             department: 'IT',
    //             annualLeave: 12,
    //             Image: '1234'
    //         })
    //         user.save()
    //     }
    // })
    app.listen(5000);
  })
  .catch((err) => {
    const error = new Error(err)
    error.httpStatusCode = 500;
    return next(error)
  });
