const User = require('../../models/User');

module.exports = {
  Query: {
    searchMentors: async (_, { skills }) => {
      const mentors = await User.find({ userRole: 'Mentor' });
      return mentors.map((mentor) => {
        const matchingSkills = mentor.userSkills.filter((skill) => skills.includes(skill));
        const matchPercentage = Math.round((matchingSkills.length / skills.length) * 100);
        return {
          ...mentor.toObject(),
          matchingSkills,
          matchPercentage,
        };
      });
    },
  },
};
