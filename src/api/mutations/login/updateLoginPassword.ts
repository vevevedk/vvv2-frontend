import { createVeveveApiClient } from "../../ApiClientFactory";
import { apiErrorCodeTranslations } from "../../apiErrorCodeTranslations";
import { ApiError, ApiErrorResponse } from "../../generated";
import { genericApiErrorMessage } from "../../genericApiErrorMessage";

export const updateLoginPassword = async (obj: { resetPasswordToken: string; password: string; }) => {
  try {
    return await createVeveveApiClient().users.updateUserPassword({ resetPasswordToken: obj.resetPasswordToken, password: obj.password })
  } catch (err) {
    var error = (err as ApiError).body as ApiErrorResponse
    throw new Error(apiErrorCodeTranslations[error.errorCode] || genericApiErrorMessage);
  }
};