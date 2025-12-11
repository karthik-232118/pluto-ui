import { createSlice } from "@reduxjs/toolkit";
import { MoveFile } from "./action";

// Movefile slice
const movefileSlice = createSlice({
  name: "movefile",
  initialState: {
    movefile: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearmovefile: (state) => {
      state.movefile = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(MoveFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(MoveFile.fulfilled, (state, action) => {
        console.log("MoveFile successful:", action.payload);
        state.loading = false;
        state.movefile = action.payload; // Storing data in state
      })
      .addCase(MoveFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  },
});

export const { clearmovefile } = movefileSlice.actions;

export default movefileSlice.reducer;
