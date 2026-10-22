const mongoose = require('mongoose');

const pestAlertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  pestName: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  affectedCrops: [{
    type: String
  }],
  symptoms: {
    type: String,
    required: true
  },
  preventiveMeasures: {
    type: String,
    default: ''
  },
  organicRemedy: {
    type: String,
    default: 'Neem oil spray (5ml per liter of water) mixed with mild soap'
  },
  chemicalRemedy: {
    type: String,
    default: ''
  },
  affectedRegions: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  reportedDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('PestAlert', pestAlertSchema);
