const express = require('express');
const router = express.Router();
const { getWeather, getPestAlerts, createPestAlert } = require('../controllers/weatherController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getWeather);
router.get('/pest-alerts', getPestAlerts);
router.post('/pest-alerts', protect, adminOnly, createPestAlert);

module.exports = router;
