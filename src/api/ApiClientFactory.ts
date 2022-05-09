import { localStorageAuthUserKey } from "../redux/loginSlice";
import { VeveveApiClient } from "./generated";

export function createVeveveApiClient() {
    var token = localStorage.getItem(localStorageAuthUserKey);
    var apiClient = new VeveveApiClient({
        BASE: process.env.REACT_APP_API_BASEURL,
        TOKEN: token ? token : undefined
    })
    return apiClient;
}