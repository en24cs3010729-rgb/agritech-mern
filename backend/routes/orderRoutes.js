const express = require('express');
const router = express.Router();
const { getOrders, createOrder, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.route('/:id')
  .get(getOrderById);

module.exports = router;
