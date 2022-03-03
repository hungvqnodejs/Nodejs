const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isdAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isdAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isdAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', isdAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isdAuth, adminController.getEditProduct);

router.post('/edit-product', isdAuth, adminController.postEditProduct);

router.post('/delete-product', isdAuth, adminController.postDeleteProduct)

module.exports = router;
