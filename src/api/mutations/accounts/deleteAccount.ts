import { createVeveveApiClient } from "../../ApiClientFactory";
import { genericApiErrorMessage } from "../../genericApiErrorMessage";

export const deleteAccount = async (obj: { id: number}) => {
  try {
    return await createVeveveApiClient().accounts.deleteAccount(obj.id)
  } catch (err) {
    throw new Error(genericApiErrorMessage);
  }
};