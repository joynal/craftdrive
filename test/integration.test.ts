import { gql } from 'apollo-server';
import { createTestClient } from 'apollo-server-testing';

import server from './server';
import userData from './user.json';
import employeeData from './employee.json';
import { Employee, User } from '../src/db';

const { query, mutate } = createTestClient(server);

describe('', () => {
  beforeAll(async () => {
    await User.remove({}, { multi: true });
    await User.insert(userData);

    await Employee.remove({}, { multi: true });
    await Employee.insert(employeeData);
  });

  afterAll(async () => { server.stop(); });

  describe('Authentication API', () => {
    describe('New signup', () => {
      it('When no password is specified, then signup will return validation error', async () => {
        const res = await mutate(<any>{
          query: gql`
            mutation SignupUser {
              signUp(email: "hi@joynal.dev") {
                token
              }
            }
          `,
        });

        const got = res.errors[0].path;
        const want = undefined;

        expect(got).toBe(want);
      });

      it('When email already exist, then signup will return invalid error', async () => {
        const res = await mutate(<any>{
          query: gql`
            mutation SignupUser {
              signUp(email: "joynal@test.com", password: "123456") {
                token
              }
            }
          `,
        });

        const got = res.errors[0].message;
        const want = 'Email already exist!';

        expect(got).toBe(want);
      });

      it('Signup will return a jwt oken, when input data is correct', async () => {
        const res = await mutate(<any>{
          query: gql`
            mutation SignupUser {
              signUp(email: "hi@joynal.dev", password: "123456") {
                token
              }
            }
          `,
        });

        const got = res.data.signUp.token;

        expect(got).toEqual(expect.any(String));
      });
    });

    describe('Login', () => {
      it('When no password is specified, then login will return validation error', async () => {
        const res = await mutate(<any>{
          query: gql`
            mutation LoginUser {
              login(email: "hi@joynal.dev") {
                token
              }
            }
          `,
        });

        const got = res.errors[0].path;
        const want = undefined;

        expect(got).toBe(want);
      });

      it('When credentials is invalid, then login will return invalid credentials error', async () => {
        const res = await mutate(<any>{
          query: gql`
            mutation LoginUser {
              login(email: "not_exist@test.com", password: "12345622") {
                token
              }
            }
          `,
        });

        const got = res.errors[0].message;
        const want = 'Email or password is invalid!';

        expect(got).toBe(want);
      });

      it('Login will return a jwt token, when input data is correct', async () => {
        const res = await mutate(<any>{
          query: gql`
            mutation LoginUser {
              login(email: "hi@joynal.dev", password: "123456") {
                token
              }
            }
          `,
        });

        const got = res.data.login.token;

        expect(got).toEqual(expect.any(String));
      });
    });
  });

  describe('Employee API', () => {
    describe('Employee List', () => {
      it('employee list api will return all employees', async () => {
        const res = await query({
          query: gql`
            query getEmployees {
              employees(filter: { limit: 10, skip: 0 }) {
                _id
                firstName
                lastName
                email
                gender
                role
                phone
              }
            }
          `,
        });

        const list = res.data.employees;
        expect(list.length).toBeGreaterThan(0);
        expect(Object.keys(list[0])).toEqual(
          expect.arrayContaining(['firstName', 'lastName', 'phone', 'email']),
        );
      });
    });

    describe('Employee Details', () => {
      it('employee details api will return single employee', async () => {
        const res = await query({
          query: gql`
            query getEmployeeDetails {
              employee(id: "1660dFap2EO1eRGt") {
                _id
                firstName
                lastName
                email
              }
            }
          `,
        });

        const { employee } = res.data;
        expect(employee.firstName).toBe('Leyla');
        expect(employee.lastName).toBe('Woodes');
        expect(employee.email).toBe('lwoodes9@timesonline.co.uk');
      });
    });

    describe('New Employee', () => {
      it('should return the employee that was added', async () => {
        const res = await mutate(<any>{
          query: gql`
            mutation CreateEmployee {
              addEmployee(
                input: {
                  firstName: "Amir"
                  lastName: "Hamza"
                  email: "hamza@gmail.com"
                }
              ) {
                _id
                firstName
                lastName
                email
              }
            }
          `,
        });

        const employee = res.data.addEmployee;

        expect(employee.firstName).toBe('Amir');
        expect(employee.lastName).toBe('Hamza');
        expect(employee.email).toBe('hamza@gmail.com');
      });
    });

    describe('Update Employee', () => {
      const UPDATE_EMPLOYEE = gql`
        mutation UpdateEmployee($id: String!, $phone: String, $firstName: String, $lastName: String) {
          updateEmployee(id: $id, input:{
            phone: $phone
            firstName: $firstName
            lastName: $lastName
          }) {
            _id
            firstName
            lastName
            phone
          }
        }
      `;

      it('if employee id does not exist, update will return null', async () => {
        const res = await mutate(<any>{
          query: UPDATE_EMPLOYEE,
          variables: {
            id: 'does_not_exist',
            phone: '0999346',
            firstName: 'Jabed',
            lastName: 'Bangali',
          },
        });

        const employee = res.data.updateEmployee;
        expect(employee).toBe(null);
      });

      it('if input is valid, should return the employee that was updated', async () => {
        const res = await mutate(<any>{
          query: UPDATE_EMPLOYEE,
          variables: {
            id: '1660dFap2EO1eRGt',
            phone: '0999346',
            firstName: 'Jabed',
            lastName: 'Bangali',
          },
        });

        const employee = res.data.updateEmployee;

        expect(employee.firstName).toBe('Jabed');
        expect(employee.lastName).toBe('Bangali');
        expect(employee.phone).toBe('0999346');
      });
    });

    describe('employee delete:', () => {
      const DELETE_EMPLOYEE = gql`
        mutation DeleteEmployee($id: String!) {
          deleteEmployee(id: $id) {
            _id
          }
        }
      `;

      it('if employee id does not exist, delete will return null', async () => {
        const res = await mutate(<any>{
          query: DELETE_EMPLOYEE,
          variables: {
            id: 'does_not_exist',
          },
        });

        expect(res.data.deleteEmployee).toBe(null);
      });

      it('if employee id is correct, should return the employee that was deleted', async () => {
        const res = await mutate(<any>{
          query: DELETE_EMPLOYEE,
          variables: {
            id: '1660dFap2EO1eRGt',
          },
        });

        const want = '1660dFap2EO1eRGt';
        const employee = res.data.deleteEmployee;
        expect(employee._id).toBe(want);
      });
    });
  });
});
