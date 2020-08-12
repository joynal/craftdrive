import Koa from 'koa';
import cors from '@koa/cors';
import { ApolloServer } from 'apollo-server-koa';

import { port } from './src/config';
import schema from './src/schema';
import context from './src/helpers/auth';

const app = new Koa();

app.use(cors(<any>{
  'Access-Control-Allow-Origin': '*',
  credentials: true,
}));

const server = new ApolloServer(<any>{
  schema,
  context,
  formatError(error) {
    console.info('server error:', error);
    return error;
  },
  introspection: true,
  playground: true,
  cors: false,
});

server.applyMiddleware({ app });

app.listen({ port }, () => console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`));

module.exports = { server, app };
