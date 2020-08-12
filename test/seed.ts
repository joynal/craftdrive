import userData from './user.json';
import employeeData from './employee.json';
import { Employee, User } from '../src/db';

const run = async () => {
  // clean previous records and insert pets
  await User.remove({}, { multi: true });
  await User.insert(userData);

  await Employee.remove({}, { multi: true });
  await Employee.insert(employeeData);
};

run();
