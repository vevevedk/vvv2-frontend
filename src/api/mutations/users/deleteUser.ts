import { createVeveveApiClient } from "../../ApiClientFactory";
import { genericApiErrorMessage } from "../../genericApiErrorMessage";

export const deleteUser = async (obj: { id: number }) => {
  try {
    return await createVeveveApiClient().accounts.deleteAccount(obj.id)
  } catch (err) {
    throw new Error(genericApiErrorMessage);
  }
};

export const deleteAccountQueryKey = "deleteAccount";
