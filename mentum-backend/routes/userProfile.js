const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Resource = require('../models/Resource');

// Get user profile by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Fetch resources uploaded by the user
        const resources = await Resource.find({ uploadedBy: id });

        res.json({
            name: user.name,
            email: user.email,
            userYear: user.userYear,
            userRole: user.userRole,
            userSkills: user.userRole === 'Mentor' ? user.userSkills : null, // Only include skills for mentors
            resources: resources.map((resource) => ({
                title: resource.title,
                description: resource.description,
                fileUrl: resource.fileUrl,
            })),
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
