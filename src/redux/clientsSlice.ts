import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createVeveveApiClient } from '../api/ApiClientFactory';
import { ClientResponse, ApiError, ApiErrorResponse } from '../api/generated';
import { handleRejected, handlePending, StatusSliceBase, genericApiErrorMessage, initialStateBase, handleSuccess } from './sliceHelper';
import { RootState } from './store';
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import { useEffect } from 'react';
import { localStorageAuthUserKey } from './loginSlice';

export interface ClientsState {
  Clients: ClientResponse[];

  GetClientsRequest: StatusSliceBase;
  UpdateClientRequest: StatusSliceBase;
  CreateClientRequest: StatusSliceBase;
  DeleteClientRequest: StatusSliceBase;
  AssumeClientRequest: StatusSliceBase;
}
const initialState: ClientsState = {
  Clients: [],
  GetClientsRequest: { ...initialStateBase },
  UpdateClientRequest: { ...initialStateBase },
  CreateClientRequest: { ...initialStateBase },
  DeleteClientRequest: { ...initialStateBase },
  AssumeClientRequest: { ...initialStateBase },
};

export const GetClientsAsync = createAsyncThunk(
  'clients/getClients',
  async (_, { rejectWithValue }) => {
    try {
      return await createVeveveApiClient().clients.getClients()
    } catch (err) {
      return rejectWithValue(genericApiErrorMessage);
    }
  },
  {
    condition: (_, {getState}) => {
      const state = (getState() as RootState).clients.GetClientsRequest;
      return state.status !== "loading" && state.lastUpdated === null;
    }
  }
);

export const CreateClientAsync = createAsyncThunk(
  'clients/createClient',
  async (obj: { name: string }, { rejectWithValue }) => {
    try {
      return await createVeveveApiClient().clients.createClient(obj)
    } catch (err) {
      var error = (err as ApiError).body as ApiErrorResponse
      var errorTranslations: any = {
        20301: "The client name already exists."
      }

      return rejectWithValue(errorTranslations[error.errorCode] || genericApiErrorMessage);
    }
  }
);

export const UpdateClientAsync = createAsyncThunk(
  'clients/updateClient',
  async (obj: { id: number, body: { name: string } }, { rejectWithValue }) => {
    try {
      return await createVeveveApiClient().clients.updateClient(obj.id, obj.body)
    } catch (err) {
      var error = (err as ApiError).body as ApiErrorResponse
      var errorTranslations: any = {
        20301: "The client name already exists."
      }

      return rejectWithValue(errorTranslations[error.errorCode] || genericApiErrorMessage);
    }
  }
);

export const AssumeClientAsync = createAsyncThunk(
  'clients/assumeClient',
  async (id: number, { rejectWithValue }) => {
    try {
      var response = await createVeveveApiClient().clients.assumeClient(id)
      localStorage.setItem(localStorageAuthUserKey, response.jwt);
      window.location.reload();
      return response;
    } catch (err) {
      return rejectWithValue(genericApiErrorMessage);
    }
  }
);

export const DeleteClientAsync = createAsyncThunk(
  'clients/deleteClient',
  async (id: number, { rejectWithValue }) => {
    try {
      await createVeveveApiClient().clients.deleteClient(id)
      return id
    } catch (err) {
      return rejectWithValue(genericApiErrorMessage);
    }
  }
);

export const ClientsSlice = createSlice({
  name: 'Clients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetClientsAsync.pending, (state) => handlePending(state.GetClientsRequest));
    builder.addCase(GetClientsAsync.rejected, (state, { payload }) => handleRejected(state.GetClientsRequest, payload as string));
    builder.addCase(GetClientsAsync.fulfilled, (state, action) => {
      handleSuccess(state.GetClientsRequest);
      state.Clients = action.payload;
    });

    builder.addCase(CreateClientAsync.pending, (state) => handlePending(state.CreateClientRequest));
    builder.addCase(CreateClientAsync.rejected, (state, { payload }) => handleRejected(state.CreateClientRequest, payload as string));
    builder.addCase(CreateClientAsync.fulfilled, (state, action) => {
      handleSuccess(state.CreateClientRequest);
      state.Clients.push(action.payload);
    });

    builder.addCase(UpdateClientAsync.pending, (state) => handlePending(state.UpdateClientRequest));
    builder.addCase(UpdateClientAsync.rejected, (state, { payload }) => handleRejected(state.UpdateClientRequest, payload as string));
    builder.addCase(UpdateClientAsync.fulfilled, (state, action) => {
      handleSuccess(state.UpdateClientRequest);
      state.Clients = state.Clients.map(a => a.id === action.payload.id ? action.payload : a);
    });

    builder.addCase(DeleteClientAsync.pending, (state) => handlePending(state.DeleteClientRequest));
    builder.addCase(DeleteClientAsync.rejected, (state, { payload }) => handleRejected(state.DeleteClientRequest, payload as string));
    builder.addCase(DeleteClientAsync.fulfilled, (state, action) => {
      handleSuccess(state.DeleteClientRequest);
      state.Clients = state.Clients.filter(a => a.id !== action.payload);
    });

    builder.addCase(AssumeClientAsync.pending, (state) => handlePending(state.AssumeClientRequest));
    builder.addCase(AssumeClientAsync.rejected, (state, { payload }) => handleRejected(state.AssumeClientRequest, payload as string));
    builder.addCase(AssumeClientAsync.fulfilled, (state, action) => handleSuccess(state.AssumeClientRequest));
  },
});

export const selectClientById = (id: number | null) => (state: RootState) => {
  if (id === null)
    return null;
  return state.clients.Clients.find(a => a.id === id) || null;
};

export const selectClientsState = (state: RootState) => {
  return {
    ...state.clients.GetClientsRequest,
    clients: state.clients.Clients,
  }
};
export const selectUpdateClientState = (state: RootState) => state.clients.UpdateClientRequest
export const selectCreateClientState = (state: RootState) => state.clients.CreateClientRequest
export const selectDeleteClientState = (state: RootState) => state.clients.DeleteClientRequest

export const useClients = () => {
  var state = useAppSelector(selectClientsState);
  var dispatch = useAppDispatch();
  dispatch(GetClientsAsync());
  return state
}


export default ClientsSlice.reducer;