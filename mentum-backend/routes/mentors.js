const express = require('express');
const router = express.Router(); // Initialize the router
const User = require('../models/User'); // Adjust the path to your User model
const Resource = require('../models/Resource');
const validateSkillsMiddleware = require('../middleware/validateSkillsMiddleware'); // Adjust the path to your middleware

// Mentor search route
router.post('/search', validateSkillsMiddleware, async (req, res) => {
    try {
        const { skills } = req.body;

        if (!skills || !Array.isArray(skills) || skills.length === 0) {
            return res.status(400).json({ message: 'Invalid or missing skills array.' });
        }

        // Fetch all mentors
        const mentors = await User.find({ userRole: 'Mentor' });

        // Calculate matches and filter mentors
        const matchingMentors = mentors
            .map((mentor) => {
                const matchingSkills = mentor.userSkills.filter((skill) => skills.includes(skill));
                const matchPercentage = (matchingSkills.length / skills.length) * 100;

                return {
                    ...mentor.toObject(),
                    matchingSkills,
                    matchPercentage: Math.round(matchPercentage), // Round to nearest integer
                };
            })
            .filter((mentor) => mentor.matchPercentage >= 50); // Include only mentors >= 50% match

        if (matchingMentors.length === 0) {
            return res.status(404).json({ message: 'No mentors match the selected skills.' });
        }

        res.json(matchingMentors);
    } catch (error) {
        console.error('Error fetching mentors:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
// Export the router
module.exports = router;
