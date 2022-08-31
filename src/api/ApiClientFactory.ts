import { VeveveApiClient } from "./generated";
import { localStorageAuthUserKey } from "./localStorageAuthUserKey";

export function createVeveveApiClient() {
    var token = localStorage.getItem(localStorageAuthUserKey);
    var apiClient = new VeveveApiClient({
        BASE: process.env.REACT_APP_API_BASEURL,
        TOKEN: token ? token : undefined
    })
    return apiClient;
}