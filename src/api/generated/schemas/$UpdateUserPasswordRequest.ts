/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UpdateUserPasswordRequest = {
    properties: {
        resetPasswordToken: {
    type: 'string',
    isRequired: true,
    format: 'uuid',
},
        password: {
    type: 'string',
    isRequired: true,
},
    },
} as const;