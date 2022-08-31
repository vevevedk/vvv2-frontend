import { createVeveveApiClient } from "../../ApiClientFactory";
import { apiErrorCodeTranslations } from "../../apiErrorCodeTranslations";
import { ApiError, ApiErrorResponse } from "../../generated";
import { genericApiErrorMessage } from "../../genericApiErrorMessage";

// TODO: state.Clients.push(action.payload);
export const updateAccount = async (obj: { id: number, body: { googleAdsAccountId: string, googleAdsAccountName: string } }) => {
  try {
    return await createVeveveApiClient().accounts.updateAccount(obj.id, obj.body)
  } catch (err) {
    var error = (err as ApiError).body as ApiErrorResponse
    throw new Error(apiErrorCodeTranslations[error.errorCode] || genericApiErrorMessage);
  }
};

export const updateAccountMutationKey = "updateAccount";
