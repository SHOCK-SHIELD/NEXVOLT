const Hazard = require('../models/Hazard');
const uploadToCloudinary = require('../utils/cloudinaryUpload');

// CREATE HAZARD REPORT
exports.createHazard = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            address,
            latitude,
            longitude
        } = req.body;

        // Validate required fields
        if (!title || !description || !category) {
            return res.status(400).json({
                message: 'Please provide title, description and category.'
            });
        }

        // Validate GPS coordinates
        const hasLatitude = latitude !== undefined && latitude !== null && latitude !== '';
        const hasLongitude = longitude !== undefined && longitude !== null && longitude !== '';

        if (hasLatitude !== hasLongitude) {
            return res.status(400).json({
                message: 'Both latitude and longitude must be provided together.'
            });
        }

        let parsedLatitude;
        let parsedLongitude;

        if (hasLatitude && hasLongitude) {
            parsedLatitude = Number(latitude);
            parsedLongitude = Number(longitude);

            if (
                !Number.isFinite(parsedLatitude) ||
                !Number.isFinite(parsedLongitude) ||
                parsedLatitude < -90 ||
                parsedLatitude > 90 ||
                parsedLongitude < -180 ||
                parsedLongitude > 180
            ) {
                return res.status(400).json({
                    message: 'Invalid GPS coordinates.'
                });
            }
        }

        // Upload media files to Cloudinary
        const media = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {

                const resourceType = file.mimetype.startsWith('video/')
                    ? 'video'
                    : 'image';

                const uploadedFile = await uploadToCloudinary(
                    file.buffer,
                    resourceType
                );

                media.push(uploadedFile);
            }
        }

        // Create hazard report
        const hazard = await Hazard.create({
            title,
            description,
            category,

            location: {
                address: address || '',
                latitude: parsedLatitude,
                longitude: parsedLongitude
            },

            media,

            reportedBy: req.user._id,

            statusHistory: [{
                status: 'pending',
                updatedBy: req.user._id,
                message: 'Hazard report submitted successfully.'
            }]
        });

        res.status(201).json({
            message: 'Hazard reported successfully!',
            hazard
        });

    } catch (error) {
        console.error('Create hazard error:', error);

        res.status(500).json({
            message: 'Failed to submit hazard report.',
            error: error.message
        });
    }
};
// GET ALL HAZARD REPORTS
exports.getAllHazards = async (req, res) => {
    try {
        const hazards = await Hazard.find()
            .populate('reportedBy', 'name profileImage')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Hazard reports fetched successfully!',
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

// GET SINGLE HAZARD WITH STATUS HISTORY
exports.getHazardById = async (req, res) => {
    try {
        const hazard = await Hazard.findById(req.params.id)
            .populate('reportedBy', 'name profileImage')
            .populate('statusHistory.updatedBy', 'name role');

        if (!hazard) {
            return res.status(404).json({
                message: 'Hazard report not found.'
            });
        }

        res.status(200).json({
            message: 'Hazard details fetched successfully!',
            hazard
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch hazard details.',
            error: error.message
        });
    }
};

// GET HAZARDS FOR MAP
exports.getHazardsForMap = async (req, res) => {
    try {
        const hazards = await Hazard.find({
            'location.latitude': { $exists: true, $ne: null },
            'location.longitude': { $exists: true, $ne: null }
        })
        .select('title category location.latitude location.longitude status createdAt');

        res.status(200).json({
            message: 'Map hazard locations fetched successfully!',
            totalHazards: hazards.length,
            hazards
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch map hazard locations.',
            error: error.message
        });
    }
};