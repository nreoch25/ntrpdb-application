import { gql } from "apollo-server-express";

export const typeDefs = gql`
  scalar Upload

  type User {
    id: ID
    token: String
    name: String
    avatar: String
    email: String
    ntrp: String
    clubs: [String]
    reviews: [Review]
    profilePicture: String
    profileVideo: String
  }

  type SuccessResponse {
    success: Boolean!
  }

  type Club {
    id: ID!
    name: String!
    address: String
    website: String
    photo: String
  }

  type Clubs {
    total: Int!
    result: [Club!]!
  }

  type Review {
    id: ID!
    player: ID
    rating: String
    review: String
  }

  type UploadedFileResponse {
    filename: String
  }

  input LogInInput {
    code: String!
  }

  input UpdateUserInput {
    id: ID!
    name: String
    ntrp: String
    clubs: [String]
    profilePicture: Upload
    profileVideo: Upload
  }

  type Query {
    googleAuthUrl: String!
    linkedInAuthUrl: String!
    facebookAuthUrl: String!
    currentUser: User
    clubs(limit: Int!, page: Int!): Clubs!
  }

  type Mutation {
    logInGoogle(input: LogInInput): User
    logInLinkedIn(input: LogInInput): User
    logInFacebook(input: LogInInput): User
    logOut: SuccessResponse!
    updateUser(input: UpdateUserInput): SuccessResponse!
  }
`;
