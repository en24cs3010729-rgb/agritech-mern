const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Seeds', 'Fertilizer', 'Bio-Pesticide', 'Equipment', 'Irrigation Tools', 'Soil Amendments'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    default: 'kg' // 'kg', 'liter', 'pack', 'piece'
  },
  inStock: {
    type: Number,
    default: 100
  },
  description: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 4.8
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=600&auto=format&fit=crop&q=80'
  },
  benefits: [String]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
