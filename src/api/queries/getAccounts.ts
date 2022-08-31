import { createVeveveApiClient } from "../ApiClientFactory";
import { genericApiErrorMessage } from "../genericApiErrorMessage";

export const getAccounts = async () => {
  try {
    return await createVeveveApiClient().accounts.getAccounts()
  }
  catch (err) {
    console.log(err);
    throw new Error(genericApiErrorMessage);
  }
};

export const getAccountsQueryKey = "getAccounts";