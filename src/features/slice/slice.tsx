import { createSlice } from "@reduxjs/toolkit";
export interface infoObj {
  id?: number;
  title?: string;
  locale?: boolean;
  creationDate?: string;
}
export interface InitSate {
  storeState?: "loading" | "success" | "error";
  infoArray?: [infoObj];
  pagination?: Object;
  actionApi?: string;
}
const initialState: InitSate = {};
export const Fetcher = createSlice({
  name: "Fetcher",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase("TABLE_LOADING", (state) => {
        state.storeState = "loading";
      })
      .addCase("ADD_ROW", (state, action: any) => {
        state.infoArray?.unshift(action.payload);
        state.storeState = "success";
      })
      .addCase("FETCH-SUCCESS", (state, action: any) => {
        state.storeState = "success";
        state.infoArray = action.payload.itemArray;
        state.pagination = action.payload.pagination;
        state.actionApi = action.payload.actionApi;
        return state;
      })
      .addCase("FETCH-FAIL", (state, action) => {
        console.log(state, action);
      });
  },
});
export const {} = Fetcher.actions;
