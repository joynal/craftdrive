import { config } from 'dotenv';

config();

const env = process.env.NODE_ENV;
const port = process.env.PORT;
const jwtSecret = process.env.JWT_SECRET;

export { env, port, jwtSecret };
