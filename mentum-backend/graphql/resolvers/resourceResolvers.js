const Resource = require('../../models/Resource');

module.exports = {
  Query: {
    resources: async (_, { search }) => {
      const filter = search
        ? { title: { $regex: search, $options: 'i' } }
        : {};
      return await Resource.find(filter).populate('uploadedBy', 'name');
    },
  },

  Mutation: {
    addResource: async (_, { input }, context) => {
      if (!context.user) throw new Error('Authentication required');

      const newResource = new Resource({
        ...input,
        uploadedBy: context.user._id,
      });

      await newResource.save();
      return newResource.populate('uploadedBy', 'name');
    },
  },
};
