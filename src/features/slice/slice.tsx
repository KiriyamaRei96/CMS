import { createSlice } from "@reduxjs/toolkit";

export interface InitSate {
  id?: string;
  Name?: string;
  types?: [string] | [];
  des?: string;
  renting?: number;
  date?: string;
  imgList?: [object | any];
  movie?: [string];
  source?: string;
}
const initialState: [InitSate][] = [];
export const Fetcher = createSlice({
  name: "Fetcher",
  initialState,
  reducers: {
    logState: (state, action) => {
      //   state = action.payload;
      state.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("FETCH-SUCCESS", (state, action: any) => {
        return (state = action.payload);
      })
      .addCase("FETCH-FAIL", (state, action) => {
        console.log(state, action);
      });
  },
});
export const { logState } = Fetcher.actions;
