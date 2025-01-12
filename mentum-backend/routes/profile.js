const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Resource = require('../models/Resource');
const profileMiddleware = require('../middleware/profileMiddleware'); // New middleware

// Fetch current user's profile
router.get('/', profileMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = req.user; // User is already attached by the middleware

        // Fetch resources uploaded by the user
        const resources = await Resource.find({ uploadedBy: userId });

        res.json({
            name: user.name,
            email: user.email,
            userRole: user.userRole,
            userYear: user.userYear,
            skills: user.userRole === 'Mentor' ? user.userSkills : [], // Include skills only for mentors
            resources: resources.map((resource) => ({
                title: resource.title,
                description: resource.description,
                fileUrl: resource.fileUrl,
            })),
        });
    } catch (error) {
        console.error('Error fetching profile data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
