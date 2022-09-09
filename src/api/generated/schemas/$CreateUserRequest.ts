/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateUserRequest = {
    properties: {
        email: {
    type: 'string',
    isRequired: true,
    pattern: '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$',
},
        fullName: {
    type: 'string',
    isRequired: true,
},
        isAdmin: {
    type: 'boolean',
    isRequired: true,
},
        clientId: {
    type: 'number',
    isRequired: true,
    format: 'int32',
},
    },
} as const;
