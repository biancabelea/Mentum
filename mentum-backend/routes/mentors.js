const express = require('express');
const router = express.Router();
const User = require('../models/User');
const validateSkills = require('../middleware/validateSkills');

// Search mentors by skills
router.post('/search',validateSkills, async (req, res) => {
  const { skills } = req.body;

  if (!skills || skills.length === 0) {
    return res.status(400).json({ message: 'Skills are required for search' });
  }

  // Find mentors that match at least 2 skills or 1 skill if fewer than 3 skills are selected
  const minSkillsToMatch = skills.length >= 3 ? 2 : 1;

  try {
    // Find mentors in the database with matching skills
    const mentors = await User.find({ userRole: 'Mentor' });

    // Filter mentors by matching skills
    const matchingMentors = mentors.filter((mentor) => {
      const commonSkills = mentor.skills.filter(skill => skills.includes(skill));
      return commonSkills.length >= minSkillsToMatch;
    });

    // Send response with the matching mentors
    res.json(matchingMentors);
  } catch (error) {
    console.error('Error during mentor search:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;