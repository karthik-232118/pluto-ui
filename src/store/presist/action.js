import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const frontendSlice = createSlice({
  name: "frontend",
  initialState,
  reducers: {
    frontendState: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetState: () => {
      return initialState;
    },
  },
});

export const { frontendState, resetState } = frontendSlice.actions;
export default frontendSlice.reducer;
