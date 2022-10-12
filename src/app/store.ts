import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import { Fetcher } from "../features/slice/slice";
import createSagaMiddleware from "redux-saga";
import mySaga from "../features/slice/saga";
import { userInfoSlice } from "../features/Component/Login/slice/UserSlice";
const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: {
    fetch: Fetcher.reducer,
    userInfo:userInfoSlice.reducer
  },
  middleware: (getDefaultMiddleware) => [sagaMiddleware],
});
sagaMiddleware.run(mySaga);
export const selectData = (state) => state.fetch;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
