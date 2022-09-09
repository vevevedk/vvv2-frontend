import { createVeveveApiClient } from "../../ApiClientFactory";
import { apiErrorCodeTranslations } from "../../apiErrorCodeTranslations";
import { ApiError, ApiErrorResponse } from "../../generated";
import { genericApiErrorMessage } from "../../genericApiErrorMessage";

export const updateUser = async (obj: { id: number, body: { email: string, fullName: string, isAdmin: boolean } }) => {
  try {
    return await createVeveveApiClient().users.updateUser(obj.id, obj.body)
  } catch (err) {
    var error = (err as ApiError).body as ApiErrorResponse
    throw new Error(apiErrorCodeTranslations[error.errorCode] || genericApiErrorMessage);
  }
};

export const updateUserQueryKey = "updateUser";
