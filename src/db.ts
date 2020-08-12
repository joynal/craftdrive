import DataStore from 'nedb-promises';

import { env } from './config';

// if env is 'test' then point to test database

const User = DataStore.create({
  autoload: true,
  timestampData: true,
  filename: env === 'test' ? './test-db/user.db' : './db/user.db',
});

const Employee = DataStore.create({
  autoload: true,
  timestampData: true,
  filename: env === 'test' ? './test-db/employee.db' : './db/employee.db',
});

export { User, Employee };
