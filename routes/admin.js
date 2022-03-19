const express = require('express');

const adminController = require('../controllers/admin')
const {isAuth, isAdmin} = require('../middleware/is-auth');


const router = express.Router();

router.get('/admin', isAuth, isAdmin,  adminController.getAdmin)


// router.post('/admin', isAuth, adminController.admin)

module.exports = router;