import { createVeveveApiClient } from "../../ApiClientFactory";
import { apiErrorCodeTranslations } from "../../apiErrorCodeTranslations";
import { ApiError, ApiErrorResponse } from "../../generated";
import { genericApiErrorMessage } from "../../genericApiErrorMessage";

// TODO: state.Clients = state.Clients.map(a => a.id === action.payload.id ? action.payload : a);
export const updateClient = async (obj: { id: number, body: { name: string } }) => {
  try {
    return await createVeveveApiClient().clients.updateClient(obj.id, obj.body)
  } catch (err) {
    var error = (err as ApiError).body as ApiErrorResponse
    throw new Error(apiErrorCodeTranslations[error.errorCode] || genericApiErrorMessage);
  }
};

export const updateClientQueryKey = "updateClient";