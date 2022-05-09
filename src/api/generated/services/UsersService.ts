/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserRequest } from '../models/CreateUserRequest';
import type { LoginResponse } from '../models/LoginResponse';
import type { LoginUserRequest } from '../models/LoginUserRequest';
import type { ResetUserPasswordRequest } from '../models/ResetUserPasswordRequest';
import type { UpdateUserPasswordRequest } from '../models/UpdateUserPasswordRequest';
import type { UpdateUserRequest } from '../models/UpdateUserRequest';
import type { UserResponse } from '../models/UserResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class UsersService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * [Admin] Create a new User
     * @param requestBody 
     * @returns UserResponse Created
     * @throws ApiError
     */
    public createUser(
requestBody?: CreateUserRequest,
): CancelablePromise<UserResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/Users',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `<p>Error codes:</p><ul><li><i>10301</i> - The provided email already exists and cannot be used</li></ul>`,
            },
        });
    }

    /**
     * Get Users for a Client
     * Will use the client claim from the jwt token.
     * @param clientId The client id. This is optional and intended for admins only. This will overrule the client id claim from jwt token
     * @returns UserResponse Success
     * @throws ApiError
     */
    public getUsers(
clientId?: number,
): CancelablePromise<Array<UserResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/Users',
            query: {
                'clientId': clientId,
            },
        });
    }

    /**
     * Update an existing User
     * This endpoint is only accessible to the user who is updating their own account.
 * Admins can update any user.
     * @param id 
     * @param requestBody 
     * @returns UserResponse Created
     * @throws ApiError
     */
    public updateUser(
id: number,
requestBody?: UpdateUserRequest,
): CancelablePromise<UserResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/Users/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `<p>Error codes:</p><ul><li><i>10303</i> - The User doesn't exist</li></ul>`,
                409: `<p>Error codes:</p><ul><li><i>10301</i> - The provided email already exists and cannot be used</li></ul>`,
            },
        });
    }

    /**
     * Delete User.
     * @param id 
     * @returns void 
     * @throws ApiError
     */
    public deleteUser(
id: number,
): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/Users/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `<p>Error codes:</p><ul><li><i>10303</i> - The User doesn't exist</li></ul>`,
            },
        });
    }

    /**
     * Login to an existing User
     * Returns a jwt token to be used with bearer authentication
     * @param requestBody 
     * @returns LoginResponse Success
     * @throws ApiError
     */
    public loginUser(
requestBody?: LoginUserRequest,
): CancelablePromise<LoginResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/Users/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `<p>Error codes:</p><ul><li><i>10101</i> - The provided email or password is incorrect</li></ul>`,
            },
        });
    }

    /**
     * Reset the password of an existing User.
     * If the email address exists, an email will be sent to the owner with a link to generate a new password.
     * @param requestBody 
     * @returns void 
     * @throws ApiError
     */
    public resetUserPassword(
requestBody?: ResetUserPasswordRequest,
): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/Users/resetPassword',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Update the password of an User using the token from the reset password email.
     * @param requestBody 
     * @returns void 
     * @throws ApiError
     */
    public updateUserPassword(
requestBody?: UpdateUserPasswordRequest,
): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/Users/updatePassword',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `<p>Error codes:</p><ul><li><i>10201</i> - The reset password token is invalid. Might have already been used</li></ul>`,
            },
        });
    }

}