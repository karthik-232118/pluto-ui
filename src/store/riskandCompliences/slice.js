import { createSlice } from "@reduxjs/toolkit";
import { GetListRiskAndCompliences } from "./action";

const ListRiskAndCompliencesSlice = createSlice({
  name: "RiskAndCompliences",
  initialState: {
    RiskAndCompliences: [], // Store fetched data
    count: 0, // Track total items
    loading: false, // Loading state
    error: null, // Error messages
  },
  reducers: {
    clear: (state) => {
      state.RiskAndCompliences = [];
      state.count = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetListRiskAndCompliences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetListRiskAndCompliences.fulfilled, (state, action) => {
        // console.log("RiskAndCompliences fetched successfully:", action.payload);
        state.loading = false;
        state.RiskAndCompliences = action.payload || [];
        state.count = action.payload.length || 0;
      })
      .addCase(GetListRiskAndCompliences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  },
});

export const { clear } = ListRiskAndCompliencesSlice.actions;
export default ListRiskAndCompliencesSlice.reducer;
