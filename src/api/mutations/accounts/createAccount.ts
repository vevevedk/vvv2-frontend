import { createVeveveApiClient } from "../../ApiClientFactory";
import { apiErrorCodeTranslations } from "../../apiErrorCodeTranslations";
import { ApiError, ApiErrorResponse } from "../../generated";
import { genericApiErrorMessage } from "../../genericApiErrorMessage";
import { getDecodedJwtToken } from "../../jwtTokenHelper";

// TODO: state.Clients.push(action.payload);
export const createAccount = async (obj: { googleAdsAccountId: string, googleAdsAccountName: string }) => {
  var clientId = getDecodedJwtToken()?.clientId;
  if (clientId == null) throw new Error("Invalid token");

  try {

    return await createVeveveApiClient().accounts.createAccount({ ...obj, clientId })
  } catch (err) {
    var error = (err as ApiError).body as ApiErrorResponse
    throw new Error(apiErrorCodeTranslations[error.errorCode] || genericApiErrorMessage);
  }
};

export const createAccountQueryKey = "createAccount";
