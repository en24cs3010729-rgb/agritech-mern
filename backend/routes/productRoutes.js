const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct } = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, adminOnly, createProduct);

router.route('/:id')
  .get(getProductById);

module.exports = router;
