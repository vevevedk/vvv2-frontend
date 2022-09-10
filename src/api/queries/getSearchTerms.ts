import { createVeveveApiClient } from "../ApiClientFactory";
import { genericApiErrorMessage } from "../genericApiErrorMessage";

export async function getSearchTerms(googleAdsCustomerId: string, lookbackDays: number){
  try {
    return await createVeveveApiClient().searchTerms.getSearchTerms(googleAdsCustomerId, lookbackDays)
  }
  catch (err) {
    console.log(err);
    throw new Error(genericApiErrorMessage);
  }
};

export const getSearchTermsQueryKey = "getSearchTerms";