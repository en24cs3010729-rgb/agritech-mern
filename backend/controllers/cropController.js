const Crop = require('../models/Crop');
const Farm = require('../models/Farm');
const store = require('../utils/memoryStore');
const { getDbStatus } = require('../config/db');

// @desc    Get all crops (optionally filter by farm)
// @route   GET /api/crops
const getCrops = async (req, res) => {
  try {
    const { farmId } = req.query;
    const farmerId = req.user._id.toString();

    if (getDbStatus()) {
      const filter = { farmer: req.user._id };
      if (farmId) filter.farm = farmId;
      const crops = await Crop.find(filter).populate('farm', 'name location');
      return res.json({ success: true, count: crops.length, data: crops });
    }

    let crops = store.crops.filter(c => c.farmer === farmerId || c.farmer === req.user.id);
    if (farmId) {
      crops = crops.filter(c => c.farm === farmId);
    }
    res.json({ success: true, count: crops.length, data: crops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single crop by ID
// @route   GET /api/crops/:id
const getCropById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      const crop = await Crop.findById(id).populate('farm', 'name location soilType');
      if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
      return res.json({ success: true, data: crop });
    }

    const crop = store.crops.find(c => c._id === id || c.id === id);
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
    res.json({ success: true, data: crop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new crop record
// @route   POST /api/crops
const createCrop = async (req, res) => {
  try {
    const { farmId, name, variety, plantingDate, expectedHarvestDate, growthStage, healthStatus, estimatedYieldKg, notes } = req.body;

    if (!farmId || !name || !plantingDate || !expectedHarvestDate) {
      return res.status(400).json({ success: false, message: 'Farm ID, name, planting and harvest dates are required' });
    }

    if (getDbStatus()) {
      const crop = await Crop.create({
        farm: farmId,
        farmer: req.user._id,
        name,
        variety: variety || 'Standard',
        plantingDate,
        expectedHarvestDate,
        growthStage: growthStage || 'Sowing / Germination',
        healthStatus: healthStatus || 'Good',
        estimatedYieldKg: estimatedYieldKg || 0,
        notes: notes || ''
      });
      await Farm.findByIdAndUpdate(farmId, { $inc: { activeCropsCount: 1 } });
      return res.status(201).json({ success: true, data: crop });
    }

    const newCrop = {
      _id: `crop_${Date.now()}`,
      id: `crop_${Date.now()}`,
      farm: farmId,
      farmer: req.user._id.toString(),
      name,
      variety: variety || 'Standard',
      plantingDate: new Date(plantingDate),
      expectedHarvestDate: new Date(expectedHarvestDate),
      growthStage: growthStage || 'Sowing / Germination',
      healthStatus: healthStatus || 'Good',
      estimatedYieldKg: Number(estimatedYieldKg) || 0,
      notes: notes || '',
      createdAt: new Date()
    };

    store.crops.push(newCrop);
    const farm = store.farms.find(f => f._id === farmId || f.id === farmId);
    if (farm) farm.activeCropsCount = (farm.activeCropsCount || 0) + 1;

    res.status(201).json({ success: true, data: newCrop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update crop (stage, health, notes)
// @route   PUT /api/crops/:id
const updateCrop = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      const crop = await Crop.findByIdAndUpdate(id, req.body, { new: true });
      if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
      return res.json({ success: true, data: crop });
    }

    const cropIndex = store.crops.findIndex(c => c._id === id || c.id === id);
    if (cropIndex === -1) return res.status(404).json({ success: false, message: 'Crop not found' });

    store.crops[cropIndex] = { ...store.crops[cropIndex], ...req.body, updatedAt: new Date() };
    res.json({ success: true, data: store.crops[cropIndex] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete crop
// @route   DELETE /api/crops/:id
const deleteCrop = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      const crop = await Crop.findById(id);
      if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
      await Crop.findByIdAndDelete(id);
      await Farm.findByIdAndUpdate(crop.farm, { $inc: { activeCropsCount: -1 } });
      return res.json({ success: true, message: 'Crop record removed' });
    }

    const crop = store.crops.find(c => c._id === id || c.id === id);
    if (crop) {
      const farm = store.farms.find(f => f._id === crop.farm || f.id === crop.farm);
      if (farm && farm.activeCropsCount > 0) farm.activeCropsCount -= 1;
    }
    store.crops = store.crops.filter(c => c._id !== id && c.id !== id);

    res.json({ success: true, message: 'Crop record removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCrops, getCropById, createCrop, updateCrop, deleteCrop };
