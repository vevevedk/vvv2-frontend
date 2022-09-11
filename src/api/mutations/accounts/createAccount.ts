import { createVeveveApiClient } from "../../ApiClientFactory";
import { apiErrorCodeTranslations } from "../../apiErrorCodeTranslations";
import { ApiError, ApiErrorResponse } from "../../generated";
import { genericApiErrorMessage } from "../../genericApiErrorMessage";

export const createAccount = async (obj: { googleAdsAccountId: string, googleAdsAccountName: string }) => {
  try {
    return await createVeveveApiClient().accounts.createAccount({ ...obj })
  } catch (err) {
    var error = (err as ApiError).body as ApiErrorResponse
    throw new Error(apiErrorCodeTranslations[error.errorCode] || genericApiErrorMessage);
  }
};

export const createAccountQueryKey = "createAccount";
