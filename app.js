const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/staff');

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes)

app.use((req, res, next) => {
    User.findById('6215385dc20b2a08e7b89e14')
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });

mongoose.connect('mongodb+srv://hungvq:Pass1@cluster0.mzvgb.mongodb.net/Staff?retryWrites=true&w=majority')
    .then(result => {
        User.findOne().then(user => {
            if(!user) {
                const user = new User({
                    name: 'Ken',
                    doB: new Date("1993-04-08"),
                    salaryScale: 1,
                    startDate: new Date("2022-02-12"),
                    department: 'IT',
                    annualLeave: 12,
                    Image: ''
                })
                user.save()
            }
        })
        
        app.listen(3000);
    })
    .catch(err => {
        console.log(err)
    })
