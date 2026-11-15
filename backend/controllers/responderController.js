const Hazard = require('../models/Hazard');
const mongoose = require('mongoose');

// GET ALL HAZARDS FOR RESPONDER DASHBOARD
exports.getResponderHazards = async (req, res) => {
    try {
        const hazards = await Hazard.find()
            .populate('reportedBy', 'name email profileImage')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Responder dashboard data fetched successfully!',
            totalHazards: hazards.length,
            hazards
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch hazard reports.',
            error: error.message
        });
    }
};


// UPDATE HAZARD STATUS
exports.updateHazardStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const allowedStatuses = [
            'pending',
            'verified',
            'in_progress',
            'resolved',
            'rejected'
        ];

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid hazard ID.'
            });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid hazard status.'
            });
        }

        const hazard = await Hazard.findById(id);

if (!hazard) {
    return res.status(404).json({
        message: 'Hazard report not found.'
    });
}

// Update current status
hazard.status = status;

// Add entry to status history
hazard.statusHistory.push({
    status: status,
    updatedBy: req.user._id,
    message: req.body.message || `Status updated to ${status}.`,
    updatedAt: new Date()
});

// Save changes
await hazard.save();

        if (!hazard) {
            return res.status(404).json({
                message: 'Hazard report not found.'
            });
        }

        res.status(200).json({
            message: 'Hazard status updated successfully!',
            hazard
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to update hazard status.',
            error: error.message
        });
    }
};