import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import loginReducer from './loginSlice';
import usersReducer from './usersSlice';
import accountsReducer from './accountsSlice';
import clientsReducer from './clientsSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    users: usersReducer,
    accounts: accountsReducer,
    clients: clientsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
