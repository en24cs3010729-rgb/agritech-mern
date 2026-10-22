const mongoose = require('mongoose');

const soilReportSchema = new mongoose.Schema({
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
  testDate: {
    type: Date,
    default: Date.now
  },
  nitrogen: {
    type: Number, // mg/kg or kg/ha
    required: true
  },
  phosphorus: {
    type: Number, // mg/kg or kg/ha
    required: true
  },
  potassium: {
    type: Number, // mg/kg or kg/ha
    required: true
  },
  phLevel: {
    type: Number, // 0 - 14 scale
    required: true
  },
  moisturePercent: {
    type: Number, // 0 - 100%
    default: 45
  },
  organicCarbonPercent: {
    type: Number, // 0 - 5%
    default: 0.65
  },
  healthScore: {
    type: Number, // 0 - 100
    default: 75
  },
  overallStatus: {
    type: String,
    enum: ['Optimal', 'Moderate', 'Deficient', 'Acidic Soil', 'Alkaline Soil'],
    default: 'Optimal'
  },
  recommendations: [{
    category: String,
    message: String,
    remedy: String
  }],
  suggestedCrops: [String]
}, { timestamps: true });

module.exports = mongoose.model('SoilReport', soilReportSchema);
