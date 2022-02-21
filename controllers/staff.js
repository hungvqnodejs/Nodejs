exports.homepage = async(req, res) => {
    res.render('index', { pageTitle: 'Trang chủ'})
}

exports.getStaff = async(req, res) => {
    res.render('staff', { pageTitle: 'Nhân viên'})
}