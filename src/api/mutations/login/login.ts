import { createVeveveApiClient } from "../../ApiClientFactory";
import { apiErrorCodeTranslations } from "../../apiErrorCodeTranslations";
import { ApiError, ApiErrorResponse } from "../../generated";
import { genericApiErrorMessage } from "../../genericApiErrorMessage";
import { localStorageAuthUserKey } from "../../localStorageAuthUserKey";

export const login = async (obj: { email: string; password: string; }) => {
  try {
    const response = await createVeveveApiClient().users.loginUser({ email: obj.email, password: obj.password })
    localStorage.setItem(localStorageAuthUserKey, response.jwt);
    return response;
  } catch (err) {
    console.log(err)
    var error = (err as ApiError).body as ApiErrorResponse
    throw new Error(apiErrorCodeTranslations[error.errorCode] || genericApiErrorMessage);
  }
};

export const loginQueryKey = "login";
