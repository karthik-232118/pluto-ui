import { createSlice } from "@reduxjs/toolkit";
import { GetAddLicenseKey, GetLicenseKeyDetails } from "./action";

const licensekeydetailsSlice = createSlice({
  name: "licensekeydetails",
  initialState: {
    licensekeydetails: [],  // Holds license key details
    loading: false,  // Tracks loading state
    error: null,  // Tracks any errors
  },
  reducers: {
    clearLicenseKeyDetails: (state) => {
      state.licensekeydetails = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle GetLicenseKeyDetails
      .addCase(GetLicenseKeyDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetLicenseKeyDetails.fulfilled, (state, action) => {
        console.log("License key details fetched:", action.payload);
        state.loading = false;
        state.licensekeydetails = action.payload;
      })
      .addCase(GetLicenseKeyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch license key details";
      })
      // Handle GetAddLicenseKey
      .addCase(GetAddLicenseKey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetAddLicenseKey.fulfilled, (state, action) => {
        console.log("License key added:", action.payload);
        state.loading = false;
        // Optionally push the added license key to the state
        // state.licensekeydetails.push(action.payload);
      })
      .addCase(GetAddLicenseKey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add license key";
      });
  },
});

export const { clearLicenseKeyDetails } = licensekeydetailsSlice.actions;
export default licensekeydetailsSlice.reducer;
