import { ApolloError, UserInputError } from 'apollo-server-koa';

import { User } from '../db';
import { generateToken } from '../helpers/token';
import { hashPassword, verifyHash } from '../helpers/password';

import { AuthReqPayload, UserType } from '../type'

// business logic
export default {
  Mutation: {
    login: async (_: any, { email, password }: AuthReqPayload) => {
      try {
        const user: UserType = await User.findOne({ email });

        if (user && (await verifyHash(password, user.hash))) {
          return { token: await generateToken(user._id) };
        }

        return new UserInputError('Email or password is invalid!');
      } catch (err) {
        console.error('login err:', err);
        return new ApolloError('Internal server error', 'INTERNAL_SERVER_ERROR');
      }
    },

    signUp: async (_: any, { email, password }: AuthReqPayload) => {
      try {
        const userExist = await User.findOne({ email });

        if (userExist) return new ApolloError('Email already exist!');

        const hash = await hashPassword(password);
        const user = await User.insert({ email, hash });

        if (user) return { token: await generateToken(user._id) };

        return new ApolloError('Something wrong!', 'INTERNAL_SERVER_ERROR');
      } catch (err) {
        console.error('signup err:', err);
        return new ApolloError('Internal server error', 'INTERNAL_SERVER_ERROR');
      }
    },
  },
};
