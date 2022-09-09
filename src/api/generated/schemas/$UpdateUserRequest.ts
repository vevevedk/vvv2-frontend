/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UpdateUserRequest = {
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
    description: `This property requires admin rights to update`,
    isNullable: true,
},
        clientId: {
    type: 'number',
    description: `This property requires admin rights to update`,
    isNullable: true,
    format: 'int32',
},
    },
} as const;
