const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar DateTime

  type User {
    _id: ID!
    name: String!
    email: String!
    userRole: String
    userYear: String
    userSkills: [String]
  }

  type Resource {
    _id: ID!
    title: String!
    description: String!
    fileUrl: String!
    uploadedBy: User!
  }

  type Comment {
    _id: ID!
    text: String!
    resource: ID!
    author: User!
    createdAt: String!
  }

  type LoginResponse {
    token: String!
    user: User!
  }

  type MentorSearchResult {
    _id: ID!
    name: String!
    email: String!
    userSkills: [String]
    matchingSkills: [String]
    matchPercentage: Int
  }

  type Availability {
    _id: ID!
    mentor: User!
    date: String!
    duration: Int!
    isBooked: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Booking {
    _id: ID!
    slot: Availability!
    date: String!
    duration: Int!
    status: String!
    mentor: User!
    mentee: User!
    createdAt: String!
    updatedAt: String!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
    userRole: String!
    userYear: String!
    userSkills: [String]!
  }

  input ResourceInput {
    title: String!
    description: String!
    fileUrl: String!
  }

  input CommentInput {
    text: String!
    resource: ID!
  }

  input AddAvailabilityInput {
    date: String!
    duration: Int!
  }

  input BookSlotInput {
    slotId: ID!
  }

  type Query {
    userProfile: User
    resources(search: String): [Resource]
    myResources: [Resource]
    comments(resourceId: ID!): [Comment]
    searchMentors(skills: [String]!): [MentorSearchResult]

    myAvailability: [Availability!]!
    mentorAvailability(mentorId: ID!): [Availability!]!
    myBookings: [Booking!]!
  }

  type Mutation {
    register(input: RegisterInput!): String
    login(email: String!, password: String!): LoginResponse
    addResource(input: ResourceInput!): Resource
    addComment(input: CommentInput!): Comment

    addAvailability(input: AddAvailabilityInput!): Availability!
    deleteAvailability(id: ID!): Boolean!
    bookSlot(input: BookSlotInput!): Booking!
    cancelBooking(id: ID!): Boolean!
  }
`;
