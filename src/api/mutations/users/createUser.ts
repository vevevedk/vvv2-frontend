import { createVeveveApiClient } from "../../ApiClientFactory";
import { apiErrorCodeTranslations } from "../../apiErrorCodeTranslations";
import { ApiError, ApiErrorResponse } from "../../generated";
import { genericApiErrorMessage } from "../../genericApiErrorMessage";
import { getDecodedJwtToken } from "../../jwtTokenHelper";

export const createUser = async (obj: { email: string, fullName: string, isAdmin: boolean }) => {
  var clientId = getDecodedJwtToken()?.clientId;
  if (clientId == null) throw new Error("Invalid token");

  try {

    return await createVeveveApiClient().users.createUser({ ...obj, clientId })
  } catch (err) {
    var error = (err as ApiError).body as ApiErrorResponse
    throw new Error(apiErrorCodeTranslations[error.errorCode] || genericApiErrorMessage);
  }
};

export const createUserQueryKey = "createUser";
