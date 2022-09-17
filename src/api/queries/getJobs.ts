import { createVeveveApiClient } from "../ApiClientFactory";
import { JobFeatureNameEnum } from "../generated";
import { genericApiErrorMessage } from "../genericApiErrorMessage";

export const getJobs = async (featureName: JobFeatureNameEnum) => {
  try {
    return await createVeveveApiClient().jobs.getJobs(featureName);
  }
  catch (err) {
    console.log(err);
    throw new Error(genericApiErrorMessage);
  }
};

export const getJobsQueryKey = "getJobs";