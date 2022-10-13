import { createSlice } from "@reduxjs/toolkit";
// import clearCookie from "../../../function/clearCookie";
import openNotificationWithIcon from "../../../function/toast";
interface info {
  id?: number;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: number | null;
  role?: string;
}
interface UserInfo {
  info?: info;
  isLogin: boolean;
}

const initialState: UserInfo = {
  isLogin: false,
};
export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    reLogin: (state) => {
      state.isLogin = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("LOGIN-SUCCESS", (state, action: any) => {
        openNotificationWithIcon(
          "success",
          "Đăng nhập thành công",
          "Chào mừng bạn đến với CMS"
        );
        state.isLogin = true;
      })
      .addCase("LOGIN_FAILED", (state, action: any) => {
        openNotificationWithIcon(
          "error",
          "Đăng nhập không thành công",
          "Vui lòng kiểm tra lại thông tin"
        );
      })
      .addCase("LOG_OUT", (state, action: any) => {
        return (state = { isLogin: false });
      })
      .addCase("GET_USER_INFO", (state, action: any) => {
        state.info = action.payload;
      })
      .addCase("UPDATE-SUCCESS", (state, action: any) => {
        openNotificationWithIcon(
          "success",
          "Cập nhật thành công",
          "Bạn đã cập nhật thông tin cá nhân"
        );
        state.info = action.payload;
      });
  },
});
export const userInfoSelector = (state) => state.userInfo;
export const { reLogin } = userInfoSlice.actions;
