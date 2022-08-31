import { createVeveveApiClient } from "../ApiClientFactory";
import { genericApiErrorMessage } from "../genericApiErrorMessage";

export const getUsers = async () => {
  try {
    return await createVeveveApiClient().users.getUsers()
  }
  catch (err) {
    console.log(err);
    throw new Error(genericApiErrorMessage);
  }
};

export const getUsersQueryKey = "getUsers";