const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Farm name is required'],
    trim: true
  },
  location: {
    address: { type: String, default: '' },
    village: { type: String, default: '' },
    district: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' }
  },
  sizeInAcres: {
    type: Number,
    required: [true, 'Farm size is required'],
    min: 0.1
  },
  soilType: {
    type: String,
    enum: ['Alluvial', 'Black', 'Red', 'Laterite', 'Clay', 'Sandy', 'Loamy'],
    default: 'Loamy'
  },
  irrigationType: {
    type: String,
    enum: ['Drip', 'Sprinkler', 'Canal', 'Borewell / Tube Well', 'Rainfed', 'Flood'],
    default: 'Drip'
  },
  waterSource: {
    type: String,
    default: 'Borewell'
  },
  activeCropsCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Farm', farmSchema);
