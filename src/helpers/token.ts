import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import { jwtSecret } from '../config';

const jwtSign: any = promisify(jwt.sign);
const jwtVerify: any = promisify(jwt.verify);

const verifyToken = (token: string) => jwtVerify(token, jwtSecret);

const generateToken = (userId: string) => jwtSign({ userId }, jwtSecret, { expiresIn: '2d' });

export { verifyToken, generateToken };
