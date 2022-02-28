const express = require('express');

const staffController = require('../controllers/staff')

const router = express.Router();

router.get('/', staffController.homepage)
router.get('/staff', staffController.getStaff)
router.get('/staff-rollcall/:rollcallId', staffController.getStaffRollcall)
router.get('/staff-leave', staffController.getStaffLeave)
router.get('/staff-end', staffController.getStaffEnd)
router.get('/info', staffController.getInfo)
router.get('/work', staffController.getWork)
router.get('/covid', staffController.getCovid)

router.post('/staff-rollcall', staffController.postStaffRollcall)
router.post('/staff-end/:rollcallId', staffController.postStaffEnd)
router.post('/info', staffController.postInfo)
router.post('/staff-leave', staffController.postStaffLeave)
router.post('/covid',staffController.postCovid)

module.exports = router;