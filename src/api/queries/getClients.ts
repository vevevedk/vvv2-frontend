import { createVeveveApiClient } from "../ApiClientFactory";
import { genericApiErrorMessage } from "../genericApiErrorMessage";

export const getClients = async () => {
  try {
    return await createVeveveApiClient().clients.getClients();
  }
  catch (err) {
    console.log(err);
    throw new Error(genericApiErrorMessage);
  }
};

export const getClientsQueryKey = "getClients";