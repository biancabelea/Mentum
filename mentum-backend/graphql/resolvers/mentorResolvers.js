const User = require('../../models/User');

module.exports = {
  Query: {
    searchMentors: async (_, { skills }, __) => {
      if (!skills || !Array.isArray(skills) || skills.length === 0) {
        throw new Error("Invalid or missing skills array.");
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
        .filter((mentor) => mentor.matchPercentage >= 50); // 👈 SAME logic as REST

      return matchingMentors;
    }
  },
};
