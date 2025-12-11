// src/store/details/slice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  detailsData: null,
  loading: false,
  error: null,
};

const detailsSlice = createSlice({
  name: "details",
  initialState,
  reducers: {
    setDetailsData(state, action) {
      state.detailsData = action.payload; // Set the fetched details data
    },
    setLoading(state, action) {
      state.loading = action.payload; // Set loading status
    },
    setError(state, action) {
      state.error = action.payload; // Set error status
    },
    clearDetailsData(state) {
      state.detailsData = null; // Clear data when needed
    },
  },
});

export const { setDetailsData, setLoading, setError, clearDetailsData } =
  detailsSlice.actions;

export default detailsSlice.reducer;
