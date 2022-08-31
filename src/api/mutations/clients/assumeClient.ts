import { createVeveveApiClient } from "../../ApiClientFactory";
import { genericApiErrorMessage } from "../../genericApiErrorMessage";
import { localStorageAuthUserKey } from "../../localStorageAuthUserKey";

export const assumeClient = async (obj: { id: number }) => {
  try {
    var response = await createVeveveApiClient().clients.assumeClient(obj.id)
    localStorage.setItem(localStorageAuthUserKey, response.jwt);
    return response;
  } catch (err) {
    throw new Error(genericApiErrorMessage);
  }
};