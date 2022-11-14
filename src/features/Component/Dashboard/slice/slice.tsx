import { createSlice } from "@reduxjs/toolkit";
import { stat } from "fs";

const initialState = {
  dashBroad: {},
};
export const dashBroadSlice = createSlice({
  name: "DashBroad",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase("SET_DASBROAD_DATA", (state, action: any) => {
      state.dashBroad = action.payload;
      return state;
    });
  },
});
export const {} = dashBroadSlice.actions;
export const dashBroadSelector = (state) => state.dasbroad;
