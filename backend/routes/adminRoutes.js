const express = require('express');
const router = express.Router();
const { getSystemStats, getAllUsers, getAllOrders, updateOrderStatus } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/stats', getSystemStats);
router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
