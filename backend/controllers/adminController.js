const User = require('../models/User');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const Order = require('../models/Order');
const PestAlert = require('../models/PestAlert');
const Product = require('../models/Product');
const store = require('../utils/memoryStore');
const { getDbStatus } = require('../config/db');

// @desc    Get Admin Dashboard system statistics
// @route   GET /api/admin/stats
const getSystemStats = async (req, res) => {
  try {
    if (getDbStatus()) {
      const [totalUsers, totalFarms, totalCrops, totalOrders, activeAlerts, totalProducts] = await Promise.all([
        User.countDocuments(),
        Farm.countDocuments(),
        Crop.countDocuments(),
        Order.countDocuments(),
        PestAlert.countDocuments({ isActive: true }),
        Product.countDocuments()
      ]);

      const orders = await Order.find();
      const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      return res.json({
        success: true,
        data: {
          totalUsers,
          totalFarms,
          totalCrops,
          totalOrders,
          activeAlerts,
          totalProducts,
          totalRevenue
        }
      });
    }

    const totalUsers = store.users.length;
    const totalFarms = store.farms.length;
    const totalCrops = store.crops.length;
    const totalOrders = store.orders.length;
    const activeAlerts = store.pestAlerts.filter(a => a.isActive).length;
    const totalProducts = store.products.length;
    const totalRevenue = store.orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalFarms,
        totalCrops,
        totalOrders,
        activeAlerts,
        totalProducts,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    if (getDbStatus()) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.json({ success: true, count: users.length, data: users });
    }

    const safeUsers = store.users.map(({ passwordHash, ...rest }) => rest);
    res.json({ success: true, count: safeUsers.length, data: safeUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders across system (Admin only)
// @route   GET /api/admin/orders
const getAllOrders = async (req, res) => {
  try {
    if (getDbStatus()) {
      const orders = await Order.find().populate('farmer', 'name email phone').sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, data: orders });
    }
    res.json({ success: true, count: store.orders.length, data: store.orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order delivery status (Admin only)
// @route   PUT /api/admin/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (getDbStatus()) {
      const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      return res.json({ success: true, data: order });
    }

    const order = store.orders.find(o => o._id === id || o.id === id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.status = status;
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSystemStats, getAllUsers, getAllOrders, updateOrderStatus };
