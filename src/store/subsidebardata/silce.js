import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subsidedata: null, // Initially no data
};

const subsidedataSlice = createSlice({
  name: "subsidedata",
  initialState,
  reducers: {
    setSubsidedata: (state, action) => {
      state.subsidedata = action.payload; // Set the data to the state
    },
    clearSubsidedata: (state) => {
      state.subsidedata = null; // Clear the data if needed
    },
  },
});

export const { setSubsidedata, clearSubsidedata } = subsidedataSlice.actions;

export default subsidedataSlice.reducer;
