const express = require('express');

const staffController = require('../controllers/staff')

const router = express.Router();

router.get('/', staffController.homepage)
router.get('/staff', staffController.getStaff)
router.get('/staff-rollcall', staffController.getStaffRollcall)
router.get('/staff-end', staffController.getStaffEnd)

router.post('/staff-rollcall', staffController.postStaffRollcall)
router.post('/staff-end', staffController.postStaffRollcall)

module.exports = router;