import { createVeveveApiClient } from "../../ApiClientFactory";
import { genericApiErrorMessage } from "../../genericApiErrorMessage";

export const deleteUser = async (obj: { id: number }) => {
  try {
    return await createVeveveApiClient().users.deleteUser(obj.id)
  } catch (err) {
    throw new Error(genericApiErrorMessage);
  }
};
