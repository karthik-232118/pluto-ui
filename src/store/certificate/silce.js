// certificateSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { GetCertificate } from "./action"; // Ensure correct path

const initialState = {
  data: {},  // Store fetched data here
  loading: false,
  error: null,
};

const certificateSlice = createSlice({
  name: "certificate",  // Standardize naming
  initialState,
  reducers: {},  // Use `extraReducers` for async
  extraReducers: (builder) => {
    builder
      .addCase(GetCertificate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetCertificate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;  // Update with API data
      })
      .addCase(GetCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  },
});

export default certificateSlice.reducer;
