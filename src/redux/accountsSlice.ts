import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createVeveveApiClient } from '../api/ApiClientFactory';
import { AccountResponse, ApiError, ApiErrorResponse } from '../api/generated';
import { handleRejected, handlePending, StatusSliceBase, genericApiErrorMessage, initialStateBase, handleSuccess } from './sliceHelper';
import { RootState } from './store';
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import { selectJwtClientId } from './loginSlice';
import { useEffect } from 'react';

export interface AccountsState {
  Accounts: AccountResponse[];

  GetAccountsRequest: StatusSliceBase;
  UpdateAccountRequest: StatusSliceBase;
  CreateAccountRequest: StatusSliceBase;
  DeleteAccountRequest: StatusSliceBase;
}
const initialState: AccountsState = {
  Accounts: [],
  GetAccountsRequest: { ...initialStateBase },
  UpdateAccountRequest: { ...initialStateBase },
  CreateAccountRequest: { ...initialStateBase },
  DeleteAccountRequest: { ...initialStateBase },
};

export const GetAccountsAsync = createAsyncThunk(
  'accounts/getAccounts',
  async (_, { rejectWithValue }) => {
    try {
      return await createVeveveApiClient().accounts.getAccounts()
    } catch (err) {
      return rejectWithValue(genericApiErrorMessage);
    }
  }
);

export const CreateAccountAsync = createAsyncThunk(
  'accounts/createAccount',
  async (obj: { googleAdsAccountId: string, googleAdsAccountName: string }, { rejectWithValue, getState }) => {
    const clientId = selectJwtClientId(getState() as RootState);
    try {
      return await createVeveveApiClient().accounts.createAccount({ ...obj, clientId: clientId! })
    } catch (err) {
      var error = (err as ApiError).body as ApiErrorResponse
      var errorTranslations: any = {
        30302: "The google ads account id already exists."
      }

      return rejectWithValue(errorTranslations[error.errorCode] || genericApiErrorMessage);
    }
  }
);

export const UpdateAccountAsync = createAsyncThunk(
  'accounts/updateAccount',
  async (obj: { id: number, body: { googleAdsAccountId: string, googleAdsAccountName: string } }, { rejectWithValue, getState }) => {
    try {
      return await createVeveveApiClient().accounts.updateAccount(obj.id, obj.body)
    } catch (err) {
      var error = (err as ApiError).body as ApiErrorResponse
      var errorTranslations: any = {
        30302: "The google ads account id already exists."
      }

      return rejectWithValue(errorTranslations[error.errorCode] || genericApiErrorMessage);
    }
  }
);

export const DeleteAccountAsync = createAsyncThunk(
  'accounts/deleteAccount',
  async (id: number, { rejectWithValue }) => {
    try {
      await createVeveveApiClient().accounts.deleteAccount(id)
      return id
    } catch (err) {
      return rejectWithValue(genericApiErrorMessage);
    }
  }
);

export const AccountsSlice = createSlice({
  name: 'Accounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetAccountsAsync.pending, (state) => handlePending(state.GetAccountsRequest));
    builder.addCase(GetAccountsAsync.rejected, (state, { payload }) => handleRejected(state.GetAccountsRequest, payload as string));
    builder.addCase(GetAccountsAsync.fulfilled, (state, action) => {
      handleSuccess(state.GetAccountsRequest);
      state.Accounts = action.payload;
    });

    builder.addCase(CreateAccountAsync.pending, (state) => handlePending(state.CreateAccountRequest));
    builder.addCase(CreateAccountAsync.rejected, (state, { payload }) => handleRejected(state.CreateAccountRequest, payload as string));
    builder.addCase(CreateAccountAsync.fulfilled, (state, action) => {
      handleSuccess(state.CreateAccountRequest);
      state.Accounts.push(action.payload);
    });

    builder.addCase(UpdateAccountAsync.pending, (state) => handlePending(state.UpdateAccountRequest));
    builder.addCase(UpdateAccountAsync.rejected, (state, { payload }) => handleRejected(state.UpdateAccountRequest, payload as string));
    builder.addCase(UpdateAccountAsync.fulfilled, (state, action) => {
      handleSuccess(state.UpdateAccountRequest);
      state.Accounts = state.Accounts.map(a => a.id === action.payload.id ? action.payload : a);
    });

    builder.addCase(DeleteAccountAsync.pending, (state) => handlePending(state.DeleteAccountRequest));
    builder.addCase(DeleteAccountAsync.rejected, (state, { payload }) => handleRejected(state.DeleteAccountRequest, payload as string));
    builder.addCase(DeleteAccountAsync.fulfilled, (state, action) => {
      handleSuccess(state.DeleteAccountRequest);
      state.Accounts = state.Accounts.filter(a => a.id !== action.payload);
    });
  },
});

export const selectAccountById = (id: number | null) => (state: RootState) => {
  if (id === null)
    return null;
  return state.accounts.Accounts.find(a => a.id === id) || null;
};

export const selectAccountsState = (state: RootState) => {
  return {
    ...state.accounts.GetAccountsRequest,
    accounts: state.accounts.Accounts,
  }
};
export const selectUpdateAccountState = (state: RootState) => state.accounts.UpdateAccountRequest
export const selectCreateAccountState = (state: RootState) => state.accounts.CreateAccountRequest
export const selectDeleteAccountState = (state: RootState) => state.accounts.DeleteAccountRequest

export const useAccounts = () => {
  var state = useAppSelector(selectAccountsState);
  var dispatch = useAppDispatch();

  useEffect(() => {
    if (state.status === "loading")
      return;

    if (state.lastUpdated === null) {
      dispatch(GetAccountsAsync());
      return;
    }
  }, [dispatch, state.lastUpdated, state.status])

  return state
}


export default AccountsSlice.reducer;