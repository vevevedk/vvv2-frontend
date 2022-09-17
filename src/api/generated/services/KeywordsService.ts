/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateKeywordsRequest } from '../models/CreateKeywordsRequest';
import type { JobResponse } from '../models/JobResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class KeywordsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Create keywords for a given Google Ads Customer ID
     * A background job will be created to perform the keyword creation.
     * @param requestBody 
     * @returns JobResponse Success
     * @throws ApiError
     */
    public postKeywords(
requestBody?: CreateKeywordsRequest,
): CancelablePromise<JobResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/Keywords',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
