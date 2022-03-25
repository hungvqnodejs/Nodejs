const express = require('express');
const { exportFilePdf } = require('../controllers/export');

const router = express.Router();

router.get('/:userId', exportFilePdf);

module.exports = router;