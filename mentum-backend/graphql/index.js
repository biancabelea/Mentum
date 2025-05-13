const { mergeResolvers } = require('@graphql-tools/merge');
const commentResolvers = require('./resolvers/commentResolvers');
const resourceResolvers = require('./resolvers/resourceResolvers');
const authResolvers = require('./resolvers/authResolvers');
const userResolvers = require('./resolvers/userResolvers');
const mentorResolvers = require('./resolvers/mentorResolvers');

const resolvers = mergeResolvers([
  commentResolvers,
  resourceResolvers,
  authResolvers,
  userResolvers,
  mentorResolvers,
]);

module.exports = resolvers;
