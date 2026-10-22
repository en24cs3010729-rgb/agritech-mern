const express = require('express');
const router = express.Router();
const { getSoilReports, createSoilReport } = require('../controllers/soilController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getSoilReports)
  .post(createSoilReport);

module.exports = router;
