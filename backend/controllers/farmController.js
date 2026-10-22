const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const store = require('../utils/memoryStore');
const { getDbStatus } = require('../config/db');

// @desc    Get all farms for logged-in farmer
// @route   GET /api/farms
const getFarms = async (req, res) => {
  try {
    const farmerId = req.user._id.toString();

    if (getDbStatus()) {
      const farms = await Farm.find({ farmer: req.user._id });
      return res.json({ success: true, count: farms.length, data: farms });
    }

    const farms = store.farms.filter(f => f.farmer === farmerId || f.farmer === req.user.id);
    res.json({ success: true, count: farms.length, data: farms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single farm by ID
// @route   GET /api/farms/:id
const getFarmById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      const farm = await Farm.findById(id);
      if (!farm) return res.status(404).json({ success: false, message: 'Farm not found' });
      return res.json({ success: true, data: farm });
    }

    const farm = store.farms.find(f => f._id === id || f.id === id);
    if (!farm) return res.status(404).json({ success: false, message: 'Farm not found' });
    res.json({ success: true, data: farm });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new farm
// @route   POST /api/farms
const createFarm = async (req, res) => {
  try {
    const { name, location, sizeInAcres, soilType, irrigationType, waterSource } = req.body;

    if (!name || !sizeInAcres) {
      return res.status(400).json({ success: false, message: 'Farm name and size are required' });
    }

    if (getDbStatus()) {
      const farm = await Farm.create({
        farmer: req.user._id,
        name,
        location: location || {},
        sizeInAcres,
        soilType: soilType || 'Loamy',
        irrigationType: irrigationType || 'Drip',
        waterSource: waterSource || 'Borewell'
      });
      return res.status(201).json({ success: true, data: farm });
    }

    const newFarm = {
      _id: `farm_${Date.now()}`,
      id: `farm_${Date.now()}`,
      farmer: req.user._id.toString(),
      name,
      location: location || { address: '', village: '', district: '', state: '', pincode: '' },
      sizeInAcres: Number(sizeInAcres),
      soilType: soilType || 'Loamy',
      irrigationType: irrigationType || 'Drip',
      waterSource: waterSource || 'Borewell',
      activeCropsCount: 0,
      createdAt: new Date()
    };

    store.farms.push(newFarm);
    res.status(201).json({ success: true, data: newFarm });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update farm
// @route   PUT /api/farms/:id
const updateFarm = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      let farm = await Farm.findById(id);
      if (!farm) return res.status(404).json({ success: false, message: 'Farm not found' });
      if (farm.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized to update this farm' });
      }
      farm = await Farm.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      return res.json({ success: true, data: farm });
    }

    const farmIndex = store.farms.findIndex(f => f._id === id || f.id === id);
    if (farmIndex === -1) return res.status(404).json({ success: false, message: 'Farm not found' });

    store.farms[farmIndex] = { ...store.farms[farmIndex], ...req.body, updatedAt: new Date() };
    res.json({ success: true, data: store.farms[farmIndex] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete farm
// @route   DELETE /api/farms/:id
const deleteFarm = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDbStatus()) {
      const farm = await Farm.findById(id);
      if (!farm) return res.status(404).json({ success: false, message: 'Farm not found' });
      await Farm.findByIdAndDelete(id);
      await Crop.deleteMany({ farm: id });
      return res.json({ success: true, message: 'Farm and associated crops deleted' });
    }

    store.farms = store.farms.filter(f => f._id !== id && f.id !== id);
    store.crops = store.crops.filter(c => c.farm !== id);
    res.json({ success: true, message: 'Farm and associated crops deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getFarms, getFarmById, createFarm, updateFarm, deleteFarm };
