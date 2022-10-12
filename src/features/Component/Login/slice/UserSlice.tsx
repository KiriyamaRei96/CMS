import { createSlice } from "@reduxjs/toolkit";

interface UserInfo {
  id?: number;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: number | null;
  role?: string;
  isLogin: boolean;
  errMessage?: string;
}

const initialState: UserInfo = {
  isLogin: false,
};
export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase("LOGIN-SUCCESS", (state, action: any) => {
        document.cookie = `token=${action.payload}`;

        console.log(document.cookie);
        state.isLogin = true;
      })
      .addCase("LOGIN_FAILED", (state, action: any) => {
        state.errMessage = action.message;
      });
  },
});
export const userInfoSelector = (state) => state.userInfo;
