// Action thunks
import { createAsyncThunk } from "@reduxjs/toolkit";
import notify from "../../assets/svg/utils/toast/Toast";
import { addLicenseKey, fetchLicenseKeyDetails } from "../../services/licensekeymanagement/LicenseKeyManagement";

// GetLicenseKeyDetails Thunk
export const GetLicenseKeyDetails = createAsyncThunk(
  "licensekeydetails/GetLicenseKeyDetails",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetchLicenseKeyDetails(data);
      if (response?.status === 200) {
        return response?.data;
      } else {
        const errorMessage = response?.data?.error || response?.error || "Something went wrong";
        notify("error", errorMessage);
        return rejectWithValue(errorMessage);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Unknown error');
    }
  }
);

export const GetAddLicenseKey = createAsyncThunk(
  "licensekeydetails/GetAddLicenseKey",  
  async (data, { rejectWithValue }) => {
    try {
      const response = await addLicenseKey(data);
      if (response?.status === 200) {
        return response?.data;
      } else {
        const errorMessage = response?.data?.error || response?.error || "Something went wrong";
        notify("error", errorMessage);
        return rejectWithValue(errorMessage);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.error || error?.response?.data || "Unknown error";
      notify("error", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
