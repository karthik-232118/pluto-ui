import { createSlice } from "@reduxjs/toolkit";
import { GetAttempts } from "./action";



// attemptsSlice

const attemptsSlice = createSlice({
  name: "attempts",
  initialState: {
    attempts: [],  // Holds the attempts results
    loading: false,  // Tracks loading state
    error: null,     // Tracks any errors
    isLoader: false
  },
  reducers: {
    clear: (state) => {
      state.attempts = [];  // Clear the attempts array
    },
  },
  extraReducers: (builder) => {
    builder
      // Handling GetAttempts
      .addCase(GetAttempts.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error when new request starts
      })
      .addCase(GetAttempts.fulfilled, (state, action) => {
        state.loading = false;
        state.attempts = action.payload; // Store the result in attempts
      })
      .addCase(GetAttempts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred"; // Set error message
      });
  },
});

export const { clear } = attemptsSlice.actions; // Export the `clear` action
export default attemptsSlice.reducer;
