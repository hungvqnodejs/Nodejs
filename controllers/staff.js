const Rollcall = require('../models/rollcall');

exports.homepage = async(req, res) => {
    res.render('index', { pageTitle: 'Trang chủ'})
}

exports.getStaff = async(req, res) => {
    res.render('staff', { pageTitle: 'Nhân viên'})
}

exports.getStaffRollcall = async(req, res) => {
    res.render('staff-rollcall', { pageTitle: 'Điểm danh'})
}

exports.postStaffRollcall = async(req, res) => {
    const startTime = new Date();
    const rollcall = new Rollcall({
      startTime: startTime,
      userId: req.user.id
    })
    rollcall.save()
            .then(result => {
                console.log(result)
                res.redirect('staff-rollcall')
            })
            .catch(err => {
                console.log(err)
            })
}

exports.getStaffEnd = async(req, res) => {
    res.render('staff-end', { pageTitle: 'Kết thúc'})
}

exports.postStaffEnd = (req, res) => {
    const endTime = req.body.endTime
}