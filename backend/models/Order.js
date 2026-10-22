const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    price: Number,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unit: String
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    address: String,
    village: String,
    district: String,
    state: String,
    pincode: String,
    phone: String
  },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery (Kisan Pay)', 'UPI', 'Direct Bank Transfer', 'Kisan Credit Card (KCC)'],
    default: 'Cash on Delivery (Kisan Pay)'
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Dispatched', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Confirmed'
  },
  estimatedDeliveryDate: {
    type: Date,
    default: () => new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
