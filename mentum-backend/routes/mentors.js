const express = require('express');
const router = express.Router();
const User = require('../models/User');
const validateSkillsMiddleware = require('../middleware/validateSkillsMiddleware');

router.post('/search', validateSkillsMiddleware, async (req, res) => {
    try {
        const { skills } = req.body;

        if (!skills || !Array.isArray(skills) || skills.length === 0) {
            return res.status(400).json({ message: 'Invalid or missing skills array.' });
        }

        const mentors = await User.find({ userRole: 'Mentor' });

        const matchingMentors = mentors
            .map((mentor) => {
                const matchingSkills = mentor.userSkills.filter((skill) => skills.includes(skill));
                const matchPercentage = (matchingSkills.length / skills.length) * 100;

                return {
                    ...mentor.toObject(),
                    matchingSkills,
                    matchPercentage: Math.round(matchPercentage),
                };
            })
            .filter((mentor) => mentor.matchPercentage >= 50);

        if (matchingMentors.length === 0) {
            return res.status(404).json({ message: 'No mentors match the selected skills.' });
        }

        res.json(matchingMentors);
    } catch (error) {
        console.error('Error fetching mentors:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const mentor = await User.findById(req.params.id);
        if (!mentor || mentor.userRole !== 'Mentor') {
            return res.status(404).json({ message: 'Mentor not found.' });
        }
        res.json(mentor);
    } catch (error) {
        console.error('Error fetching mentor by ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;
