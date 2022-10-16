import { createSlice } from "@reduxjs/toolkit";
export interface infoObj {
  id?: number;
  title?: string;
  published?: boolean;
  creationDate?: string;
  featureImage?: Object;
  address?: string | null;
  ar?: string | null;
  lat?: number | null;
  lng?: number | null;
  vr?: Object | null;
}
export interface InitSate {
  storeState?: "loading" | "success" | "error";
  infoArray: [infoObj] | any;
  pagination?: Object;
  actionApi?: string;
}
const initialState: InitSate = {
  infoArray: [],
};
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
      .addCase("UPDATE_ROW", (state, action: any) => {
        state.infoArray = state.infoArray.map((obj) => {
          if (obj.id === action.payload.id) {
            return (obj = action.payload);
          }
          return obj;
        });
        state.storeState = "success";
      })
      .addCase("DELETE_ROW", (state, action: any) => {
        state.infoArray = state.infoArray.filter(
          (obj) => obj.id !== action.payload
        );
        state.storeState = "success";
      })
      .addCase("FETCH-SUCCESS", (state, action: any) => {
        state.storeState = "success";
        state.infoArray = action.payload.itemArray;
        state.pagination = action.payload.pagination;
        state.actionApi = action.payload.actionApi;
        return state;
      })
      .addCase("SEARCH-SUCCESS", (state, action: any) => {
        state.infoArray = action.payload.itemArray;
        state.pagination = action.payload.pagination;
        state.storeState = "success";
        return state;
      })
      .addCase("FETCH-FAIL", (state, action) => {
        console.log(state, action);
      });
  },
});
export const {} = Fetcher.actions;
