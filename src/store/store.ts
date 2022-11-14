import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import { Fetcher } from "../features/Component/List/slice/slice";
import createSagaMiddleware from "redux-saga";

import { userInfoSlice } from "../features/Component/Login/slice/UserSlice";
import rootSaga from "./rootSaga";
import { dashBroadSlice } from "../features/Component/Dashboard/slice/slice";
import { settingSlice } from "../features/Component/WebSetting/slice/slice";

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: {
    fetch: Fetcher.reducer,
    userInfo:userInfoSlice.reducer,
    dasbroad:dashBroadSlice.reducer,
    setting:settingSlice.reducer
  },
  middleware: (getDefaultMiddleware) => [sagaMiddleware],
  
});
sagaMiddleware.run(rootSaga);
export const selectData = (state) => state.fetch;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
