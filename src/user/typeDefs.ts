import { gql } from 'apollo-server';

// type definitions
export default gql`
  type User {
    _id: ID
    email: Email
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  extend type Mutation {
    login(email: Email!, password: String!): AuthPayload!
    signUp(email: Email!, password: String!): AuthPayload!
  }
`;
