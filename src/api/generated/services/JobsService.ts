/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JobFeatureNameEnum } from '../models/JobFeatureNameEnum';
import type { JobResponse } from '../models/JobResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class JobsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @param featureName 
     * @returns JobResponse Success
     * @throws ApiError
     */
    public getJobs(
featureName: JobFeatureNameEnum,
): CancelablePromise<Array<JobResponse>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/v1/Jobs',
            query: {
                'featureName': featureName,
            },
        });
    }

}
