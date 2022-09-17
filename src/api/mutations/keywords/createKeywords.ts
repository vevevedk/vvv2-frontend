import { createVeveveApiClient } from "../../ApiClientFactory";
import { apiErrorCodeTranslations } from "../../apiErrorCodeTranslations";
import { ApiError, ApiErrorResponse } from "../../generated";
import { genericApiErrorMessage } from "../../genericApiErrorMessage";

export const createNegativeKeywords = async (obj: {
  googleAdsAccountId: string, keywords: {
    adGroupId: string,
    keywordText: string
  }[]
}) => {
  try {
    return await createVeveveApiClient().keywords.postKeywords({
      googleAdsCustomerId: obj.googleAdsAccountId,
      negative: true,
      keywords: obj.keywords
    })
  } catch (err) {
    var error = (err as ApiError).body as ApiErrorResponse
    throw new Error(apiErrorCodeTranslations[error.errorCode] || genericApiErrorMessage);
  }
};