import { createVeveveApiClient } from "../../ApiClientFactory";
import { genericApiErrorMessage } from "../../genericApiErrorMessage";

export const deleteClient = async (obj: { id: number }) => {
  try {
    await createVeveveApiClient().clients.deleteClient(obj.id)
  } catch (err) {
    throw new Error(genericApiErrorMessage);
  }
};

export const deleteClientQueryKey = "deleteClient";