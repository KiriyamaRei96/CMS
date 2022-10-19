import { createSlice } from "@reduxjs/toolkit";
export interface infoObj {
  id?: number;
  title?: string;
  published?: boolean;
  creationDate?: string;
  featureImage?: Object;
  address?: string | null;
  ar?: string | null;
  lat?: string | number | null;
  lng?: string | number | null;
  vr?: Object | null;
}
export interface InitSate {
  storeState?: "loading" | "success" | "error";
  infoArray: [infoObj] | any;
  pagination?: Object;
  actionApi?: string;
  localeArr?: Object;
  locale: string;
}
const initialState: InitSate = {
  infoArray: [],
  localeArr: {},
  locale: "vi",
};
export const Fetcher = createSlice({
  name: "Fetcher",
  initialState,
  reducers: {
    setLocate: (state, action) => {
      state.locale = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("TABLE_LOADING", (state) => {
        state.storeState = "loading";
      })
      .addCase("GET_LOCALE", (state, action: any) => {
        state.localeArr = action.payload;
        state.storeState = "success";
      })
      .addCase("ADD_ROW", (state, action: any) => {
        state.infoArray?.unshift(action.payload);
        state.storeState = "success";
      })
      .addCase("UPDATE_ROW", (state, action: any) => {
        state.infoArray = state.infoArray.map((obj) => {
          if (obj.id && obj.id === action.payload.id) {
            return (obj = action.payload);
          }
          if (obj.name && obj.name === action.payload.name) {
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
export const { setLocate } = Fetcher.actions;
