import { User } from '../db';
import { verifyToken } from './token';

export default async ({ ctx }) => {
  try {
    const res: any = await verifyToken(ctx.request.header.authorization || null);

    const { userId } = res;

    const exist = await User.findOne({ _id: userId });

    if (!exist) return { jwtError: 'user not found!' };

    return { userId };
  } catch (error) {
    return { jwtError: 'JWT token is not valid!' };
  }
};
