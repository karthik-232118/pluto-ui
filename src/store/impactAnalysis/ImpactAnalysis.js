import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ModuleID: null,
  ImpactAnalysisTarget: null,
  name: "",
};

const impactAnalysisSlice = createSlice({
  name: "Impact Analysis",
  initialState,
  reducers: {
    impactAnalysis: (state, action) => {
      return {
        state: action.payload,
      };
    },
  },
});

export const { impactAnalysis } = impactAnalysisSlice.actions;
export default impactAnalysisSlice.reducer;
