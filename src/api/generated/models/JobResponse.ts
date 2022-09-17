/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JobErrorResponse } from './JobErrorResponse';
import type { JobFeatureNameEnum } from './JobFeatureNameEnum';
import type { JobStatusEnum } from './JobStatusEnum';

export type JobResponse = {
    id: number;
    jobStatus: JobStatusEnum;
    body: string;
    featureName: JobFeatureNameEnum;
    createdDate: string;
    lastModifiedDate: string;
    errors: Array<JobErrorResponse>;
};
