import { GetGlobalSearch } from "./action";
import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    search: [],  // Holds the search results
    loading: false,  // Tracks loading state
    error: null,  // Tracks any errors
    endTestResult: null, 
  },
  reducers: {
    clear: (state) => {
      state.search = [];  // Correctly mutates the search array to clear it
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetGlobalSearch.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error when new request starts
      })
      .addCase(GetGlobalSearch.fulfilled, (state, action) => {
        console.log("GetGlobalSearch fulfilled:", action.payload);
        state.loading = false;
        state.search = action.payload; // Store the search result in `search`
      })
      .addCase(GetGlobalSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "An error occurred"; // Set error message
      });
  },
});

export const { clear } = searchSlice.actions; // Export the `clear` action
export default searchSlice.reducer;
