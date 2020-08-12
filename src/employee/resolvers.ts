import { Employee } from '../db';
import { Filter } from '../type'

// business logic
export default {
  Query: {
    employees: async (_: any, filter: Filter) => {
      // has pagination support
      const limit = filter.limit || 20;
      const skip = filter.skip || 0;

      const employees = await Employee.find({})
        .sort({ createdAt: 'desc' })
        .skip(skip)
        .limit(limit);

      return employees;
    },

    employee: async (_: any, { id }: any) => {
      const employee = await Employee.findOne({ _id: id });
      return employee;
    },
  },

  Mutation: {
    addEmployee: async (_: any, { input }: any) => {
      try {
        const employee = await Employee.insert(input);

        return employee;
      } catch (error) {
        console.error('employee create err:', error);
        return error;
      }
    },

    updateEmployee: async (_: any, { id, input }: any) => {
      try {
        await Employee.update({ _id: id }, { $set: input });
        const employee = await Employee.findOne({ _id: id });

        return employee;
      } catch (error) {
        console.error('employee update err:', error);
        return error;
      }
    },

    deleteEmployee: async (_: any, { id }: any) => {
      try {
        const employee = await Employee.findOne({ _id: id });
        await Employee.remove({ _id: id }, { multi: false });

        return employee || null;
      } catch (error) {
        console.error('employee delete err:', error);
        return error;
      }
    },
  },
};
