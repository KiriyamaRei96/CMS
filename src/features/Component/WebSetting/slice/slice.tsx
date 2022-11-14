import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
};
export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase("SET_SETTING", (state, action: any) => {
      state.data = action.payload;
    });
  },
});
export const {} = settingSlice.actions;
export const settingSelector = (state) => state.setting;
