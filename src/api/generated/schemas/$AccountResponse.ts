/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AccountResponse = {
    properties: {
        id: {
    type: 'number',
    isRequired: true,
    format: 'int32',
},
        googleAdsAccountId: {
    type: 'string',
    isRequired: true,
},
        googleAdsAccountName: {
    type: 'string',
    isRequired: true,
},
        createdDate: {
    type: 'string',
    isRequired: true,
    format: 'date-time',
},
        lastModifiedDate: {
    type: 'string',
    isRequired: true,
    format: 'date-time',
},
    },
} as const;
