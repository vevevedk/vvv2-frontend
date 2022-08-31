import jwtDecode from "jwt-decode";
import { localStorageAuthUserKey } from "./localStorageAuthUserKey";

export const getDecodedJwtToken = () => {
    var token = localStorage.getItem(localStorageAuthUserKey);
    if (token == null) return null;

    try {
        return jwtDecode<JwtTokenDecoded>(token);
    }
    catch (err) {
        console.log("ERROR:", err);
        return null;
    }
}

export interface JwtTokenDecoded {
    exp: number;
    email: string;
    fullName: string;
    userId: number;
    clientId: number;
    clientName: string;
    isAdmin?: boolean;
}