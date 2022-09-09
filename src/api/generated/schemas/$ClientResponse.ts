/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ClientResponse = {
    properties: {
        id: {
    type: 'number',
    isRequired: true,
    format: 'int32',
},
        name: {
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
