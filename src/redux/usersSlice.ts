import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createVeveveApiClient } from '../api/ApiClientFactory';
import { UserResponse, ApiError, ApiErrorResponse } from '../api/generated';
import { handleRejected, handlePending, StatusSliceBase, genericApiErrorMessage, initialStateBase, handleSuccess } from './sliceHelper';
import { RootState } from './store';
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import { selectJwtClientId } from './loginSlice';
import { useEffect } from 'react';

export interface UsersState {
  Users: UserResponse[];

  GetUsersRequest: StatusSliceBase;
  UpdateUserRequest: StatusSliceBase;
  CreateUserRequest: StatusSliceBase;
  DeleteUserRequest: StatusSliceBase;
}
const initialState: UsersState = {
  Users: [],
  GetUsersRequest: { ...initialStateBase },
  UpdateUserRequest: { ...initialStateBase },
  CreateUserRequest: { ...initialStateBase },
  DeleteUserRequest: { ...initialStateBase },
};

export const GetUsersAsync = createAsyncThunk(
  'users/getUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await createVeveveApiClient().users.getUsers()
    } catch (err) {
      return rejectWithValue(genericApiErrorMessage);
    }
  },
  {
    condition: (_, {getState}) => {
      const request = (getState() as RootState).users.GetUsersRequest;
      return request.status !== "loading" && request.lastUpdated === null;
    }
  }
);

export const CreateUserAsync = createAsyncThunk(
  'users/createUser',
  async (obj: { email: string, fullName: string, isAdmin: boolean }, { rejectWithValue, getState }) => {
    const clientId = selectJwtClientId(getState() as RootState);
    try {
      return await createVeveveApiClient().users.createUser({ ...obj, clientId: clientId! })
    } catch (err) {
      var error = (err as ApiError).body as ApiErrorResponse
      var errorTranslations: any = {
        10301: "The provided email address is already in use."
      }

      return rejectWithValue(errorTranslations[error.errorCode] || genericApiErrorMessage);
    }
  }
);

export const UpdateUserAsync = createAsyncThunk(
  'users/updateUser',
  async (obj: { id: number, body: { email: string, fullName: string, isAdmin: boolean } }, { rejectWithValue, getState }) => {
    try {
      return await createVeveveApiClient().users.updateUser(obj.id, obj.body)
    } catch (err) {
      var error = (err as ApiError).body as ApiErrorResponse
      var errorTranslations: any = {
        10301: "The provided email address is already in use."
      }

      return rejectWithValue(errorTranslations[error.errorCode] || genericApiErrorMessage);
    }
  }
);

export const DeleteUserAsync = createAsyncThunk(
  'users/deleteUser',
  async (id: number, { rejectWithValue }) => {
    try {
      await createVeveveApiClient().users.deleteUser(id)
      return id
    } catch (err) {
      return rejectWithValue(genericApiErrorMessage);
    }
  }
);

export const UsersSlice = createSlice({
  name: 'Users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetUsersAsync.pending, (state) => handlePending(state.GetUsersRequest));
    builder.addCase(GetUsersAsync.rejected, (state, { payload }) => handleRejected(state.GetUsersRequest, payload as string));
    builder.addCase(GetUsersAsync.fulfilled, (state, action) => {
      handleSuccess(state.GetUsersRequest);
      state.Users = action.payload;
    });

    builder.addCase(CreateUserAsync.pending, (state) => handlePending(state.CreateUserRequest));
    builder.addCase(CreateUserAsync.rejected, (state, { payload }) => handleRejected(state.CreateUserRequest, payload as string));
    builder.addCase(CreateUserAsync.fulfilled, (state, action) => {
      handleSuccess(state.CreateUserRequest);
      state.Users.push(action.payload);
    });

    builder.addCase(UpdateUserAsync.pending, (state) => handlePending(state.UpdateUserRequest));
    builder.addCase(UpdateUserAsync.rejected, (state, { payload }) => handleRejected(state.UpdateUserRequest, payload as string));
    builder.addCase(UpdateUserAsync.fulfilled, (state, action) => {
      handleSuccess(state.UpdateUserRequest);
      state.Users = state.Users.map(a => a.id === action.payload.id ? action.payload : a);
    });

    builder.addCase(DeleteUserAsync.pending, (state) => handlePending(state.DeleteUserRequest));
    builder.addCase(DeleteUserAsync.rejected, (state, { payload }) => handleRejected(state.DeleteUserRequest, payload as string));
    builder.addCase(DeleteUserAsync.fulfilled, (state, action) => {
      handleSuccess(state.DeleteUserRequest);
      state.Users = state.Users.filter(a => a.id !== action.payload);
    });
  },
});

export const selectUserById = (id: number | null) => (state: RootState) => {
  if (id === null)
    return null;
  return state.users.Users.find(a => a.id === id) || null;
};

export const selectUsersState = (state: RootState) => {
  return {
    ...state.users.GetUsersRequest,
    users: state.users.Users,
  }
};
export const selectUpdateUserState = (state: RootState) => state.users.UpdateUserRequest
export const selectCreateUserState = (state: RootState) => state.users.CreateUserRequest
export const selectDeleteUserState = (state: RootState) => state.users.DeleteUserRequest

export const useUsers = () => {
  var state = useAppSelector(selectUsersState);
  var dispatch = useAppDispatch();
  dispatch(GetUsersAsync());
  return state
}


export default UsersSlice.reducer;