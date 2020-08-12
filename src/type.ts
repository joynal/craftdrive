type Filter = {
    limit: number;
    skip: number;
};

type AuthReqPayload = {
    email: string;
    password: string;
};

type EmployeeInput = {
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    role: string;
    phone: string;
}

type UserType = {
    _id: string;
    email: string;
    hash: string;
}

export { Filter, AuthReqPayload, EmployeeInput, UserType }
