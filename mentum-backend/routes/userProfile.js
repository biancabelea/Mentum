const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Resource = require('../models/Resource');

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const resources = await Resource.find({ uploadedBy: id });

        res.json({
            name: user.name,
            email: user.email,
            userYear: user.userYear,
            userRole: user.userRole,
            userSkills: user.userRole === 'Mentor' ? user.userSkills : null,
            resources: resources.map((resource) => ({
                title: resource.title,
                description: resource.description,
                fileUrl: resource.fileUrl,
            })),
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
