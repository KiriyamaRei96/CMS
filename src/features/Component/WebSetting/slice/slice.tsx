import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  infoArray: [],
  localeArr: {},
  locale: "vi",
  parentID: null,
  storeState: "success",
};
export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase("TABLE_LOADING", (state) => {
      state.storeState = "loading";
    });
  },
});
export const {} = settingSlice.actions;
export const settingSelector = (state) => state.setting;
