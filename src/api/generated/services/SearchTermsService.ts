/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SearchTermResponse } from '../models/SearchTermResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class SearchTermsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Gets all search terms for a given Google Ads Customer ID and with a number of days of which to evaluate
     * @param googleAdsCustomerId 
     * @param lookbackDays 
     * @returns SearchTermResponse Success
     * @throws ApiError
     */
    public getSearchTerms(
googleAdsCustomerId: string,
lookbackDays: number,
): CancelablePromise<Array<SearchTermResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/v1/SearchTerms',
            query: {
                'googleAdsCustomerId': googleAdsCustomerId,
                'lookbackDays': lookbackDays,
            },
        });
    }

}
