import { gql } from 'apollo-server';

// employee type definitions
// added extra @auth directive for enforcing authentication
export default gql`
  type Employee {
    _id: ID!
    firstName: String
    lastName: String
    email: Email
    gender: String
    role: String
    phone: String
  }

  input EmployeeInput {
    firstName: String
    lastName: String
    email: Email
    gender: String
    role: String
    phone: String
  }

  input Pagination {
    limit: Int
    skip: Int
  }

  extend type Query {
    employees(filter: Pagination): [Employee] @auth
    employee(id: String!): Employee @auth
  }

  extend type Mutation {
    addEmployee(input: EmployeeInput!): Employee @auth
    updateEmployee(id: String!, input: EmployeeInput!): Employee @auth
    deleteEmployee(id: String): Employee @auth
  }
`;
