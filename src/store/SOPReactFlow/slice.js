import { createSlice } from "@reduxjs/toolkit";
import { GetCreateSOPReactFlow, GetViewSOPReactFlow, UploadImageSOPReactFlow } from "./action";
import notify from "../../assets/svg/utils/toast/Toast";

const SOPReactFlowSlice = createSlice({
  name: "SOPReactFlow",
  initialState: {
    SOPReactFlow: [], // Holds the SOP React Flow data
    loading: false,   // Tracks loading state
    error: null,      // Tracks any errors
  },
  reducers: {
    clear: (state) => {
      state.SOPReactFlow = []; // Correctly clears the SOPReactFlow data
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetCreateSOPReactFlow.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error when a new request starts
      })
      .addCase(GetCreateSOPReactFlow.fulfilled, (state, action) => {
        console.log("GetCreateSOPReactFlow fulfilled:", action.payload);
        state.loading = false;
        state.SOPReactFlow = action.payload; // Store the fetched data
      })
      .addCase(GetCreateSOPReactFlow.rejected, (state, action) => {
        state.loading = false;
        const errorMessage =
          action.payload?.message ||
          action.payload?.error ||
          "An unexpected error occurred";
        state.error = errorMessage;
        // notify("error", errorMessage);
      })
      .addCase(GetViewSOPReactFlow.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error when a new request starts
      })
      .addCase(GetViewSOPReactFlow.fulfilled, (state, action) => {
        state.loading = false;
        state.SOPReactFlow = action.payload; // Store the fetched data
      })
      .addCase(GetViewSOPReactFlow.rejected, (state, action) => {
        state.loading = false;
        const errorMessage =
          action.payload?.message ||
          action.payload?.error ||
          "An unexpected error occurred";
        state.error = errorMessage;
        // notify("error", errorMessage);
      })
      .addCase(UploadImageSOPReactFlow.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error when a new request starts
      })
      .addCase(UploadImageSOPReactFlow.fulfilled, (state, action) => {
        console.log("UploadImageSOPReactFlow fulfilled:", action.payload);
        state.loading = false;
        state.imageURL = action.payload; // Store the uploaded image URL
      })
      .addCase(UploadImageSOPReactFlow.rejected, (state, action) => {
        state.loading = false;
        const errorMessage =
          action.payload?.message ||
          action.payload?.error ||
          "An unexpected error occurred";
        state.error = errorMessage;
        // notify("error", errorMessage);
      });
  },
});

export const { clear } = SOPReactFlowSlice.actions; // Export the `clear` action
export default SOPReactFlowSlice.reducer;
