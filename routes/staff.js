const express = require('express');

const staffController = require('../controllers/staff')
const {isAuth} = require('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth, staffController.homepage)
router.get('/staff', isAuth, staffController.getStaff)
router.get('/staff-rollcall/:rollcallId', isAuth, staffController.getStaffRollcall)
router.get('/staff-leave', isAuth, staffController.getStaffLeave)
router.get('/staff-end', isAuth,  staffController.getStaffEnd)
router.get('/info', isAuth, staffController.getInfo)
router.get('/work', isAuth, staffController.getWork)
router.get('/covid', isAuth, staffController.getCovid)

router.post('/staff-rollcall',isAuth,  staffController.postStaffRollcall)
router.post('/staff-end/:rollcallId',isAuth,  staffController.postStaffEnd)
router.post('/info',isAuth,  staffController.postInfo)
router.post('/staff-leave',isAuth,  staffController.postStaffLeave)
router.post('/covid', isAuth, staffController.postCovid)

module.exports = router;