import { createVeveveApiClient } from "../../ApiClientFactory";
import { genericApiErrorMessage } from "../../genericApiErrorMessage";

// TODO: state.Clients = state.Clients.filter(a => a.id !== action.payload);
export const deleteClient = async (obj: { id: number }) => {
  try {
    await createVeveveApiClient().clients.deleteClient(obj.id)
  } catch (err) {
    throw new Error(genericApiErrorMessage);
  }
};

export const deleteClientQueryKey = "deleteClient";