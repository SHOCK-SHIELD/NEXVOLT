const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const responderOnly = require('../middleware/responderMiddleware');

const {
    getResponderHazards,
    updateHazardStatus
} = require('../controllers/responderController');

// Responder dashboard - Get all hazards
router.get('/hazards', protect, responderOnly, getResponderHazards);

// Update hazard status
router.put('/hazards/:id/status', protect, responderOnly, updateHazardStatus);

module.exports = router;