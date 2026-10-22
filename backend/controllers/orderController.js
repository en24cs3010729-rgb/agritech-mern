const Order = require('../models/Order');
const store = require('../utils/memoryStore');
const { getDbStatus } = require('../config/db');

// @desc    Get logged-in farmer's orders
// @route   GET /api/orders
const getOrders = async (req, res) => {
  try {
    const farmerId = req.user._id.toString();

    if (getDbStatus()) {
      const orders = await Order.find({ farmer: req.user._id }).sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, data: orders });
    }

    const orders = store.orders.filter(o => o.farmer === farmerId || o.farmer === req.user.id);
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0 || !totalAmount) {
      return res.status(400).json({ success: false, message: 'Cart items and total amount are required' });
    }

    if (getDbStatus()) {
      const order = await Order.create({
        farmer: req.user._id,
        items,
        totalAmount,
        shippingAddress: shippingAddress || {},
        paymentMethod: paymentMethod || 'Cash on Delivery (Kisan Pay)',
        status: 'Confirmed'
      });
      return res.status(201).json({ success: true, data: order });
    }

    const newOrder = {
      _id: `ord_${Date.now()}`,
      id: `ord_${Date.now()}`,
      farmer: req.user._id.toString(),
      items,
      totalAmount: Number(totalAmount),
      shippingAddress: shippingAddress || {
        address: 'Farm House #12',
        village: 'Raikot',
        district: 'Ludhiana',
        state: 'Punjab',
        pincode: '141109',
        phone: '+91 98765 43210'
      },
      paymentMethod: paymentMethod || 'Cash on Delivery (Kisan Pay)',
      status: 'Confirmed',
      estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    };

    store.orders.unshift(newOrder);
    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      return res.json({ success: true, data: order });
    }

    const order = store.orders.find(o => o._id === id || o.id === id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getOrders, createOrder, getOrderById };
