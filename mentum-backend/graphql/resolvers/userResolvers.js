const User = require('../../models/User');

module.exports = {
  Query: {
    userProfile: async (_, __, context) => {
      if (!context.user) throw new Error('Authentication required');

      const user = await User.findById(context.user._id);
      if (!user) throw new Error('User not found');

      return user;
    },
  },
};
