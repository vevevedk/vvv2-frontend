/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetSearchTermsResponse } from '../models/GetSearchTermsResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class SearchTermsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Gets all search terms for a given Google Ads Customer ID and with a number of days of which to evaluate
     * @param googleAdsCustomerId 
     * @param lookbackDays 
     * @returns GetSearchTermsResponse Success
     * @throws ApiError
     */
    public getSearchTerms(
googleAdsCustomerId: string,
lookbackDays: number,
): CancelablePromise<GetSearchTermsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/SearchTerms',
            query: {
                'GoogleAdsCustomerId': googleAdsCustomerId,
                'LookbackDays': lookbackDays,
            },
        });
    }

}
