import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';
import { createVeveveApiClient } from '../api/ApiClientFactory';
import { ApiError, ApiErrorResponse } from '../api/generated';
import { genericApiErrorMessage, handlePending, handleRejected, initialStateBase, StatusSliceBase } from './sliceHelper';
import { AppThunk, RootState } from './store';

export const localStorageAuthUserKey = "token";

export interface JwtTokenDecoded {
  exp: number;
  email: string;
  fullName: string;
  userId: number;
  clientId: number;
  clientName: string;
  isAdmin?: boolean;
}

export interface LoginState {
  updateLoginPasswordRequest: StatusSliceBase
  loginRequest: StatusSliceBase
  jwt: string | null;
}
const initialState: LoginState = {
  jwt: localStorage.getItem(localStorageAuthUserKey),
  loginRequest: { ...initialStateBase },
  updateLoginPasswordRequest: { ...initialStateBase },
};

export const loginAsync = createAsyncThunk(
  'login/authenticate',
  async (request: { email: string; password: string; }, { rejectWithValue }) => {
    try {
      const response = await createVeveveApiClient().users.loginUser({ email: request.email, password: request.password })
      localStorage.setItem(localStorageAuthUserKey, response.jwt);
      return response;
    } catch (err) {
      var error = (err as ApiError).body as ApiErrorResponse
      var errorTranslations: any = {
        10101: "The provided email address or password is incorrect.",
      }

      return rejectWithValue(errorTranslations[error.errorCode] || genericApiErrorMessage);
    }
  },
  { condition: (_, { getState }) => (getState() as RootState).login.loginRequest.status !== "loading" }
);

export const updateLoginPasswordAsync = createAsyncThunk(
  'login/updatePassword',
  async (request: { resetPasswordToken: string; password: string; }, { rejectWithValue }) => {
    try {
      await createVeveveApiClient().users.updateUserPassword({ resetPasswordToken: request.resetPasswordToken, password: request.password })
      return true;
    } catch (err) {
      var error = (err as ApiError).body as ApiErrorResponse
      var errorTranslations: any = {
        10201: "Linket er udløbet."
      }

      return rejectWithValue(errorTranslations[error.errorCode] || genericApiErrorMessage);
    }
  },
  { condition: (_, { getState }) => (getState() as RootState).login.updateLoginPasswordRequest.status !== "loading" }
);

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    logout: state => {
      state.jwt = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginAsync.pending, (state) => handlePending(state.loginRequest));
    builder.addCase(loginAsync.rejected, (state, { payload }) => handleRejected(state.loginRequest, payload as string));
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      state.loginRequest.status = 'idle';
      state.jwt = action.payload.jwt;
    });

    builder.addCase(updateLoginPasswordAsync.pending, (state) => handlePending(state.updateLoginPasswordRequest));
    builder.addCase(updateLoginPasswordAsync.rejected, (state, { payload }) => handleRejected(state.updateLoginPasswordRequest, payload as string));
    builder.addCase(updateLoginPasswordAsync.fulfilled, (state, action) => {
      state.updateLoginPasswordRequest.status = 'idle';
      state.updateLoginPasswordRequest.successMessage = "Your password has been updated. Please login again.";
    });
  },
});

export const selectLoginState = (state: RootState) => state.login.loginRequest;
export const selectIsLoggedIn = (state: RootState) => state.login.jwt != null;
export const selectJwtFullname = (state: RootState) => selectJwtDecoded(state)?.fullName;
export const selectJwtClientId = (state: RootState) => selectJwtDecoded(state)?.clientId;
export const selectJwtClient = (state: RootState) => {
  var jwt = selectJwtDecoded(state)
  if (!jwt)
    return null
    
  return {clientId: jwt.clientId, clientName: jwt.clientName}
}

export const selectJwtIsAdmin = (state: RootState) => selectJwtDecoded(state)?.isAdmin;
export const selectJwtUserId = (state: RootState) => selectJwtDecoded(state)?.userId;

export const selectJwtDecoded = (state: RootState) => {
  if (state.login.jwt == null)
    return null;

  try {
    return jwtDecode<JwtTokenDecoded>(state.login.jwt);
  }
  catch (err) {
    console.log("ERROR:", err);
    return null;
  }
}

export const selectUpdateLoginPasswordState = (state: RootState) => state.login.updateLoginPasswordRequest;



export const logout = (): AppThunk => (dispatch, getState) => {
  localStorage.removeItem(localStorageAuthUserKey);
  dispatch(loginSlice.actions.logout());
};


export default loginSlice.reducer;


