const Comment = require('../../models/Comment');

module.exports = {
  Query: {
    comments: async (_, { resourceId }) => {
      return await Comment.find({ resource: resourceId })
        .populate('author', 'name')
        .sort({ createdAt: -1 });
    },
  },

  Mutation: {
    addComment: async (_, { input }, context) => {
      if (!context.user) throw new Error('Authentication required');

      const newComment = new Comment({
        text: input.text,
        resource: input.resource,
        author: context.user._id,
      });

      await newComment.save();
      return newComment.populate('author', 'name');
    },
  },
};
