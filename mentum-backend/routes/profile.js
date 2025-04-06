const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Resource = require('../models/Resource');
const profileMiddleware = require('../middleware/profileMiddleware');

router.get('/', profileMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = req.user; 
        const resources = await Resource.find({ uploadedBy: userId });

        res.json({
            name: user.name,
            email: user.email,
            userRole: user.userRole,
            userYear: user.userYear,
            skills: user.userRole === 'Mentor' ? user.userSkills : [],
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
