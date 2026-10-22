const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true
  },
  variety: {
    type: String,
    default: 'Standard'
  },
  plantingDate: {
    type: Date,
    required: true
  },
  expectedHarvestDate: {
    type: Date,
    required: true
  },
  growthStage: {
    type: String,
    enum: ['Sowing / Germination', 'Vegetative', 'Flowering', 'Grain Filling / Fruiting', 'Maturity / Ready to Harvest'],
    default: 'Vegetative'
  },
  healthStatus: {
    type: String,
    enum: ['Excellent', 'Good', 'Moderate', 'Needs Attention', 'Pest Infected'],
    default: 'Good'
  },
  estimatedYieldKg: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);
