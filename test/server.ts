import Koa from 'koa';
import { ApolloServer } from 'apollo-server-koa';

import schema from '../src/schema';

const app = new Koa();

// simple testable server instance with exact same schema
const server = new ApolloServer({
  schema,
  // mock authentication context
  context: () => ({ userId: '5cddHrl8GhkFiFn6' }),
});

server.applyMiddleware({ app });

export default server;
