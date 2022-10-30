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
  storeState?: "loading" | "success" | "error" | "idle";
  infoArray: [infoObj] | any;
  pagination?: Object;
  actionApi?: string;
  localeArr?: Object;
  parentID?: string | number | null;
  locale: string;
  errorMessage?: string;
}
const initialState: InitSate = {
  infoArray: [],
  localeArr: {},
  locale: "vi",
  parentID: null,
  storeState: "success",
};
export const Fetcher = createSlice({
  name: "Fetcher",
  initialState,
  reducers: {
    setLocate: (state, action) => {
      state.locale = action.payload;
    },
    setParentID: (state, action) => {
      state.parentID = action.payload;
    },
    setActionApi: (state, action) => {
      state.actionApi = action.payload;
    },
    setSucces: (state) => {
      // state.storeState = "success";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("TABLE_LOADING", (state) => {
        state.storeState = "loading";
      })
      .addCase("GET_LOCALE", (state, action: any) => {
        state.localeArr = action.payload;
        // state.storeState = "success";
      })
      .addCase("ADD_ROW", (state, action: any) => {
        state.infoArray?.unshift(action.payload);
        // state.storeState = "success";
      })
      .addCase("ADD_ROW_FAILED", (state, action: any) => {
        state.errorMessage = action.payload;
        state.storeState = "error";
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
        // state.storeState = "success";
      })
      .addCase("DELETE_ROW", (state, action: any) => {
        state.infoArray = state.infoArray.filter((obj) =>
          obj.id ? obj.id !== action.payload : obj.name !== action.payload
        );
        // state.storeState = "success";
      })
      .addCase("FETCH-SUCCESS", (state, action: any) => {
        state.infoArray = action.payload.itemArray;
        state.pagination = action.payload.pagination;
        // state.storeState = "success";
        return state;
      })
      .addCase("SEARCH-SUCCESS", (state, action: any) => {
        state.infoArray = action.payload.itemArray;
        state.pagination = action.payload.pagination;
        // state.storeState = "success";
        return state;
      })
      .addCase("SET-SUCCESS", (state, action) => {
        state.storeState = "success";
        return state;
      })
      .addCase("SET-IDLE", (state, action) => {
        state.storeState = "idle";
        return state;
      })
      .addCase("FETCH-FAIL", (state, action) => {
        console.log(state, action);
      });
  },
});
export const { setLocate, setParentID, setActionApi, setSucces } =
  Fetcher.actions;
