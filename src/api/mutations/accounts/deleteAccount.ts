import { createVeveveApiClient } from "../../ApiClientFactory";
import { genericApiErrorMessage } from "../../genericApiErrorMessage";

// TODO: state.Clients.push(action.payload);
export const deleteAccount = async (obj: { id: number}) => {
  try {
    return await createVeveveApiClient().accounts.deleteAccount(obj.id)
  } catch (err) {
    throw new Error(genericApiErrorMessage);
  }
};

export const deleteAccountQueryKey = "deleteAccount";
