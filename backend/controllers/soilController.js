const SoilReport = require('../models/SoilReport');
const { analyzeSoil } = require('../utils/recommendationEngine');
const store = require('../utils/memoryStore');
const { getDbStatus } = require('../config/db');

// @desc    Get all soil reports for logged-in farmer
// @route   GET /api/soil
const getSoilReports = async (req, res) => {
  try {
    const farmerId = req.user._id.toString();

    if (getDbStatus()) {
      const reports = await SoilReport.find({ farmer: req.user._id }).populate('farm', 'name location');
      return res.json({ success: true, count: reports.length, data: reports });
    }

    const reports = store.soilReports.filter(s => s.farmer === farmerId || s.farmer === req.user.id);
    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new soil test report with automated analysis
// @route   POST /api/soil
const createSoilReport = async (req, res) => {
  try {
    const { farmId, nitrogen, phosphorus, potassium, phLevel, moisturePercent, organicCarbonPercent } = req.body;

    if (!farmId || nitrogen === undefined || phosphorus === undefined || potassium === undefined || phLevel === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide Farm ID, Nitrogen, Phosphorus, Potassium, and pH' });
    }

    const analysis = analyzeSoil(
      Number(nitrogen),
      Number(phosphorus),
      Number(potassium),
      Number(phLevel),
      Number(moisturePercent || 45),
      Number(organicCarbonPercent || 0.65)
    );

    if (getDbStatus()) {
      const report = await SoilReport.create({
        farm: farmId,
        farmer: req.user._id,
        nitrogen: Number(nitrogen),
        phosphorus: Number(phosphorus),
        potassium: Number(potassium),
        phLevel: Number(phLevel),
        moisturePercent: Number(moisturePercent || 45),
        organicCarbonPercent: Number(organicCarbonPercent || 0.65),
        healthScore: analysis.healthScore,
        overallStatus: analysis.overallStatus,
        recommendations: analysis.recommendations,
        suggestedCrops: analysis.suggestedCrops
      });
      return res.status(201).json({ success: true, data: report });
    }

    const newReport = {
      _id: `soil_${Date.now()}`,
      id: `soil_${Date.now()}`,
      farm: farmId,
      farmer: req.user._id.toString(),
      testDate: new Date(),
      nitrogen: Number(nitrogen),
      phosphorus: Number(phosphorus),
      potassium: Number(potassium),
      phLevel: Number(phLevel),
      moisturePercent: Number(moisturePercent || 45),
      organicCarbonPercent: Number(organicCarbonPercent || 0.65),
      healthScore: analysis.healthScore,
      overallStatus: analysis.overallStatus,
      recommendations: analysis.recommendations,
      suggestedCrops: analysis.suggestedCrops,
      createdAt: new Date()
    };

    store.soilReports.unshift(newReport);
    res.status(201).json({ success: true, data: newReport });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSoilReports, createSoilReport };
