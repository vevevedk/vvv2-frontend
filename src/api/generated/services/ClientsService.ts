/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientResponse } from '../models/ClientResponse';
import type { CreateClientRequest } from '../models/CreateClientRequest';
import type { UpdateClientRequest } from '../models/UpdateClientRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ClientsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * [Admin] Create a new Client.
     * @param requestBody 
     * @returns ClientResponse Created
     * @throws ApiError
     */
    public createClient(
requestBody?: CreateClientRequest,
): CancelablePromise<ClientResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/Clients',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `<p>Error codes:</p><ul><li><i>20301</i> - The client name already exists</li></ul>`,
            },
        });
    }

    /**
     * [Admin] Get Clients
     * @returns ClientResponse Success
     * @throws ApiError
     */
    public getClients(): CancelablePromise<Array<ClientResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/Clients',
        });
    }

    /**
     * [Admin] Update an existing Client
     * @param id 
     * @param requestBody 
     * @returns ClientResponse Created
     * @throws ApiError
     */
    public updateClient(
id: number,
requestBody?: UpdateClientRequest,
): CancelablePromise<ClientResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/v1/Clients/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `<p>Error codes:</p><ul><li><i>20101</i> - The client doesn't exist</li></ul>`,
                409: `<p>Error codes:</p><ul><li><i>20301</i> - The client name already exists</li></ul>`,
            },
        });
    }

    /**
     * [Admin] Delete Client.
     * @param id 
     * @returns void 
     * @throws ApiError
     */
    public deleteClient(
id: number,
): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/v1/Clients/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `<p>Error codes:</p><ul><li><i>20101</i> - The client doesn't exist</li></ul>`,
            },
        });
    }

}