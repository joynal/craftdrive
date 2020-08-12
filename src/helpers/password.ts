import bcrypt from 'bcrypt';

const saltRounds = 14;

const hashPassword = async (password: string) => bcrypt.hash(password, saltRounds);

const verifyHash = (password: string, hash: string) => bcrypt.compare(password, hash);

export { hashPassword, verifyHash };
