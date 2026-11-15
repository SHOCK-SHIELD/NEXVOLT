const express = require('express');
const router = express.Router();

const {
    createHazard,
    getAllHazards,
    getHazardById,
    getHazardsForMap
} = require('../controllers/hazardController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Submit a new hazard report (login required)
router.post('/', protect, upload.array('media', 5), createHazard);

// Get all hazard reports
router.get('/', getAllHazards);

router.get('/map', getHazardsForMap);

// Get single hazard with status history
router.get('/:id', getHazardById);

module.exports = router;