const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLSchema, GraphQLNonNull, GraphQLInputObjectType } = require('graphql');
const User = require('../models/User');
const Resource = require('../models/Resource');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ResourceType = new GraphQLObjectType({
  name: 'Resource',
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    fileUrl: { type: GraphQLString },
    uploadedBy: {
      type: UserType,
      resolve(parent) {
        return User.findById(parent.uploadedBy);
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    userRole: { type: GraphQLString },
    userYear: { type: GraphQLString },
    userSkills: { type: new GraphQLList(GraphQLString) },
    resources: {
      type: new GraphQLList(ResourceType),
      resolve(parent) {
        return Resource.find({ uploadedBy: parent._id });
      },
    },
    matchPercentage: { type: GraphQLString },
    matchingSkills: { type: new GraphQLList(GraphQLString) },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    resources: {
      type: new GraphQLList(ResourceType),
      args: { search: { type: GraphQLString } },
      resolve(_, args) {
        if (args.search) {
          return Resource.find({ title: { $regex: args.search, $options: 'i' } });
        }
        return Resource.find();
      },
    },
    userProfile: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(_, args, context) {
        const userId = args.id || context.user?._id;
        return User.findById(userId);
      },
    },
    searchMentors: {
      type: new GraphQLList(UserType),
      args: {
        skills: { type: new GraphQLList(GraphQLString) },
      },
      async resolve(_, { skills }) {
        const mentors = await User.find({ userRole: 'Mentor' });
        return mentors.map((mentor) => {
          const matchingSkills = mentor.userSkills.filter(skill => skills.includes(skill));
          const matchPercentage = ((matchingSkills.length / skills.length) * 100).toFixed(2) + '%';
          return {
            ...mentor.toObject(),
            matchingSkills,
            matchPercentage,
          };
        });
      },
    },
  },
});

const AddResourceInput = new GraphQLInputObjectType({
  name: 'AddResourceInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    fileUrl: { type: GraphQLString },
    uploadedBy: { type: new GraphQLNonNull(GraphQLID) },
  },
});

const RegisterInput = new GraphQLInputObjectType({
  name: 'RegisterInput',
  fields: {
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    userYear: { type: GraphQLString },
    userRole: { type: GraphQLString },
    userSkills: { type: new GraphQLList(GraphQLString) },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addResource: {
      type: ResourceType,
      args: { input: { type: AddResourceInput } },
      async resolve(_, { input }) {
        const newRes = new Resource(input);
        return await newRes.save();
      },
    },
    register: {
      type: GraphQLString,
      args: { input: { type: RegisterInput } },
      async resolve(_, { input }) {
        const hashedPassword = await bcrypt.hash(input.password, 10);
        await User.create({ ...input, password: hashedPassword });
        return { message: 'User registered' };
      },
    },
    login: {
      type: new GraphQLObjectType({
        name: 'LoginResponse',
        fields: {
          token: { type: GraphQLString },
          user: { type: UserType },
        },
      }),
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(_, { email, password }) {
        const user = await User.findOne({ email });
        if (!user) throw new Error('Invalid email');
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error('Invalid password');

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        return { token, user };
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
