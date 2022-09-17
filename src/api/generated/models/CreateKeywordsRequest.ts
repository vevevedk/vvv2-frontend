/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { KeywordRequest } from './KeywordRequest';

export type CreateKeywordsRequest = {
    googleAdsCustomerId: string;
    negative: boolean;
    keywords: Array<KeywordRequest>;
};
