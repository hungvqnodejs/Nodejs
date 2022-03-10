const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/staff');
const errorController = require('./controllers/error');

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes)
app.use(errorController.get404);

app.use((req, res, next) => {
    User.findById('622a39cc77623164fa38e577')
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });

mongoose.connect('mongodb+srv://hungvq:Pass1@cluster0.mzvgb.mongodb.net/Staff2?retryWrites=true&w=majority')
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
                    Image: '1234'
                })
                user.save()
            }
        })
        
        app.listen(3000);
    })
    .catch(err => {
        console.log(err)
    })
