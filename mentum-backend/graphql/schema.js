const { gql } = require('apollo-server-express');

module.exports = gql`
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

  type Query {
    userProfile: User
    resources(search: String): [Resource]
    comments(resourceId: ID!): [Comment]
    searchMentors(skills: [String]!): [MentorSearchResult]
  }

  type Mutation {
    register(input: RegisterInput!): String
    login(email: String!, password: String!): LoginResponse
    addResource(input: ResourceInput!): Resource
    addComment(input: CommentInput!): Comment
  }
`;
