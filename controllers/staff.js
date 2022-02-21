exports.homepage = async(req, res) => {
    res.render('index', { pageTitle: 'Trang chủ'})
}

exports.getStaff = async(req, res) => {
    res.render('staff', { pageTitle: 'Nhân viên'})
}

exports.getStaffRollcall = async(req, res) => {
    res.render('staff-rollcall', { pageTitle: 'Điểm danh'})
}

exports.getStaffEnd = async(req, res) => {
    res.render('staff-end', { pageTitle: 'Kết thúc'})
}