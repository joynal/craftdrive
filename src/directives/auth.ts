import { defaultFieldResolver } from 'graphql';
import { AuthenticationError, SchemaDirectiveVisitor } from 'apollo-server-koa';

// custom graphql directive for authentication

/* eslint-disable class-methods-use-this, no-param-reassign */
class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: any) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function resolving(...args: any[]) {
      const ctx = args[2];

      if (ctx.jwtError) throw new AuthenticationError(ctx.jwtError);

      if (ctx.userId) return resolve.apply(this, args);

      throw new AuthenticationError('You must be logged in!');
    };
  }
}
/* eslint-enable class-methods-use-this, no-param-reassign */

export default AuthDirective;
