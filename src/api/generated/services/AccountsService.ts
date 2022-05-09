/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountResponse } from '../models/AccountResponse';
import type { CreateAccountRequest } from '../models/CreateAccountRequest';
import type { UpdateAccountRequest } from '../models/UpdateAccountRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AccountsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * [Admin] Create a new Account.
     * @param requestBody 
     * @returns AccountResponse Created
     * @throws ApiError
     */
    public createAccount(
requestBody?: CreateAccountRequest,
): CancelablePromise<AccountResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/Accounts',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `<p>Error codes:</p><ul><li><i>30302</i> - The provided google ads id already exists</li></ul>`,
            },
        });
    }

    /**
     * Get Accounts
     * @returns AccountResponse Success
     * @throws ApiError
     */
    public getAccounts(): CancelablePromise<Array<AccountResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/Accounts',
        });
    }

    /**
     * [Admin] Update an existing Account
     * @param id 
     * @param requestBody 
     * @returns AccountResponse Created
     * @throws ApiError
     */
    public updateAccount(
id: number,
requestBody?: UpdateAccountRequest,
): CancelablePromise<AccountResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/Accounts/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `<p>Error codes:</p><ul><li><i>30101</i> - The User doesn't exist</li></ul>`,
                409: `<p>Error codes:</p><ul><li><i>30302</i> - The provided google ads id already exists</li></ul>`,
            },
        });
    }

    /**
     * [Admin] Delete Account.
     * @param id 
     * @returns void 
     * @throws ApiError
     */
    public deleteAccount(
id: number,
): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/Accounts/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `<p>Error codes:</p><ul><li><i>30101</i> - The User doesn't exist</li></ul>`,
            },
        });
    }

}