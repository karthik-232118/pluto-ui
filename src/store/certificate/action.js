// certificateAction.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetCertificateApi } from "../../services/certificate/Certificate"; // Correct path

export const GetCertificate = createAsyncThunk(
  "certificate/fetchCertificate",  // Prefix with slice name
  async (data, { rejectWithValue }) => {
    try {
      const response = await GetCertificateApi(data);
      if (response.status === 200) {
        return response.data;  // Payload returned on success
      } else {
        return rejectWithValue("Failed to fetch certificate data");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);
