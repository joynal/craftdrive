import { EmailAddressResolver } from 'graphql-scalars';
import { gql, makeExecutableSchema } from 'apollo-server-koa';

import authDirective from './directives/auth';
import userTypeDefs from './user/typeDefs';
import userResolvers from './user/resolvers';
import employeeTypeDefs from './employee/typeDefs';
import employeeResolvers from './employee/resolvers';

// define base type definition
// added email type support with third party package
const rootTypeDefs = gql`
  directive @auth on FIELD_DEFINITION
  scalar Email
  type Query
  type Mutation
  schema {
    query: Query
    mutation: Mutation
  }
`;

// define schema with types & resolvers
export default makeExecutableSchema({
  typeDefs: [rootTypeDefs, employeeTypeDefs, userTypeDefs],
  resolvers: {
    Email: EmailAddressResolver,
    Query: {
      ...employeeResolvers.Query,
    },
    Mutation: {
      ...userResolvers.Mutation,
      ...employeeResolvers.Mutation,
    },
  },

  // custom directive authentication - '@auth'
  schemaDirectives: {
    auth: authDirective,
  },
});
