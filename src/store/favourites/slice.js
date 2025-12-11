import { createSlice } from "@reduxjs/toolkit";
import { GetFavourites, GetAddFavourites } from "./action";

const favouritesSlice = createSlice({
  name: "favourites",
  initialState: {
    favourites: null, // Holds the favourites results (API response object)
    loading: false, // Tracks loading state
    error: null, // Tracks any errors
  },
  reducers: {
    clear: (state) => {
      state.favourites = null; // Clear the favourites data
    },
  },
  extraReducers: (builder) => {
    builder
      // Handling GetFavourites
      .addCase(GetFavourites.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error when new request starts
      })
      .addCase(GetFavourites.fulfilled, (state, action) => {
        console.log("GetFavourites fulfilled:", action.payload);
        state.loading = false;
        state.favourites = action.payload; // Store the result in favourites
      })
      .addCase(GetFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred"; // Set error message
      })

      // Handling GetAddFavourites
      .addCase(GetAddFavourites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetAddFavourites.fulfilled, (state, action) => {
        console.log("GetAddFavourites fulfilled:", action.payload);
        state.loading = false;
        // Since AddFavourites doesn't return updated list, we don't need to modify the favourites array here
        // The success is handled in the component with toast notification
        // If you need to update the local favourites list, it should be done by calling GetFavourites again
      })
      .addCase(GetAddFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add to favourites";
      });
  },
});

export const { clear } = favouritesSlice.actions; // Export the `clear` action
export default favouritesSlice.reducer;
