const PestAlert = require('../models/PestAlert');
const store = require('../utils/memoryStore');
const { getDbStatus } = require('../config/db');

// @desc    Get real-time weather and 5-day agro-forecast
// @route   GET /api/weather
const getWeather = async (req, res) => {
  try {
    const { district = 'Ludhiana', state = 'Punjab' } = req.query;

    // Rich agronomic weather data simulation based on location
    const weatherData = {
      location: {
        district,
        state,
        country: 'India'
      },
      current: {
        tempC: 28,
        feelsLikeC: 29,
        condition: 'Clear Sky / Sunny',
        humidity: 58,
        windKph: 12,
        windDirection: 'NW',
        uvIndex: 7,
        soilTemperatureC: 24,
        precipitationChance: 10,
        spraySuitability: 'Excellent for Foliar Spray (Low Wind & Dry)',
        irrigationAdvice: 'Moderate evaporation rate. Light drip irrigation recommended in afternoon.'
      },
      forecast: [
        { day: 'Today', tempMax: 30, tempMin: 18, condition: 'Sunny', rainChance: 5, advisory: 'Ideal for sowing & fertilizer application' },
        { day: 'Tomorrow', tempMax: 31, tempMin: 19, condition: 'Partly Cloudy', rainChance: 15, advisory: 'Good harvesting window' },
        { day: 'Day 3', tempMax: 29, tempMin: 17, condition: 'Mild Breeze', rainChance: 25, advisory: 'Ensure deep root watering' },
        { day: 'Day 4', tempMax: 27, tempMin: 16, condition: 'Light Showers', rainChance: 65, advisory: 'Hold off pesticide spraying due to rain' },
        { day: 'Day 5', tempMax: 28, tempMin: 17, condition: 'Sunny / Clear', rainChance: 20, advisory: 'Drain standing water from nurseries' }
      ]
    };

    res.json({ success: true, data: weatherData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all active pest alerts
// @route   GET /api/weather/pest-alerts
const getPestAlerts = async (req, res) => {
  try {
    if (getDbStatus()) {
      const alerts = await PestAlert.find({ isActive: true }).sort({ createdAt: -1 });
      return res.json({ success: true, count: alerts.length, data: alerts });
    }
    const alerts = store.pestAlerts.filter(a => a.isActive);
    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new pest alert (Admin only)
// @route   POST /api/weather/pest-alerts
const createPestAlert = async (req, res) => {
  try {
    const { title, pestName, severity, affectedCrops, symptoms, preventiveMeasures, organicRemedy, chemicalRemedy, affectedRegions } = req.body;

    if (!title || !pestName || !symptoms) {
      return res.status(400).json({ success: false, message: 'Title, pest name, and symptoms are required' });
    }

    if (getDbStatus()) {
      const alert = await PestAlert.create({
        title,
        pestName,
        severity: severity || 'Medium',
        affectedCrops: Array.isArray(affectedCrops) ? affectedCrops : [affectedCrops],
        symptoms,
        preventiveMeasures: preventiveMeasures || '',
        organicRemedy: organicRemedy || '',
        chemicalRemedy: chemicalRemedy || '',
        affectedRegions: Array.isArray(affectedRegions) ? affectedRegions : [affectedRegions],
        isActive: true
      });
      return res.status(201).json({ success: true, data: alert });
    }

    const newAlert = {
      _id: `pest_${Date.now()}`,
      id: `pest_${Date.now()}`,
      title,
      pestName,
      severity: severity || 'Medium',
      affectedCrops: Array.isArray(affectedCrops) ? affectedCrops : [affectedCrops],
      symptoms,
      preventiveMeasures: preventiveMeasures || '',
      organicRemedy: organicRemedy || '',
      chemicalRemedy: chemicalRemedy || '',
      affectedRegions: Array.isArray(affectedRegions) ? affectedRegions : [affectedRegions],
      isActive: true,
      reportedDate: new Date()
    };

    store.pestAlerts.unshift(newAlert);
    res.status(201).json({ success: true, data: newAlert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getWeather, getPestAlerts, createPestAlert };
