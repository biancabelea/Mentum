const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');

module.exports = {
  Mutation: {
    register: async (_, { input }) => {
      const existingUser = await User.findOne({ email: input.email });
      if (existingUser) throw new Error('Email already in use');

      const hashedPassword = await bcrypt.hash(input.password, 10);
      const newUser = new User({
        ...input,
        password: hashedPassword,
      });

      await newUser.save();
      return 'User registered';
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('Invalid credentials');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid credentials');

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      return {
        token,
        user,
      };
    },
  },
};
