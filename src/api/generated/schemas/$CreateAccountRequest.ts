/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateAccountRequest = {
    properties: {
        googleAdsAccountId: {
    type: 'string',
    isRequired: true,
},
        googleAdsAccountName: {
    type: 'string',
    isRequired: true,
},
        clientId: {
    type: 'number',
    isRequired: true,
    format: 'int32',
},
    },
} as const;