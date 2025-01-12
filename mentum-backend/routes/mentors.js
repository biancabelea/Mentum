const express = require('express');
const router = express.Router();
const User = require('../models/User');
const validateSkills = require('../middleware/validateSkillsMiddleware');

router.post('/search', validateSkills, async (req, res) => {
    try {
        const { skills } = req.body;
        console.log('Input skills:', skills);

        const mentors = await User.find({ userRole: 'Mentor' });
        console.log('Mentors retrieved:', mentors);

        const matchingMentors = mentors.filter((mentor) => {
            if (!mentor.userSkills || !Array.isArray(mentor.userSkills)) {
                console.log(`Mentor ${mentor.name} has invalid or missing skills property.`);
                return false; // Skip mentors with invalid or missing skills
            }

            // Find common skills between input skills and mentor skills
            const commonSkills = mentor.userSkills.filter(skill => skills.includes(skill));
            if (commonSkills.length > 0) {
                console.log(`Mentor ${mentor.name} matches with skills: ${commonSkills}`);
                mentor.matchingSkills = commonSkills; // Add matching skills to mentor object
                return true;
            } else {
                console.log(`Mentor ${mentor.name} has no matching skills.`);
                return false;
            }
        });

        if (matchingMentors.length === 0) {
            return res.status(404).json({ message: 'No mentors match the selected skills.' });
        }

        res.json(
            matchingMentors.map((mentor) => ({
                name: mentor.name,
                email: mentor.email,
                matchingSkills: mentor.matchingSkills, // Return only matching skills
            }))
        );
    } catch (error) {
        console.error('Error during mentor search:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
module.exports = router;
