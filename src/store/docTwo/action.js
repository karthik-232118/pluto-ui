import { createAsyncThunk } from "@reduxjs/toolkit";
import { DocTwoAPI } from "../../services/doctwo/DocTwo";

// GetDocTwo - Fetch Document Two Data
export const GetDocTwo = createAsyncThunk(
  "docTwo/fetch",
  async (data, { rejectWithValue }) => {
    try {
      const response = await DocTwoAPI(data);
      if (response?.status === 200 && response.data) {
        return response.data; // Ensure returning necessary data
      } else {
        return rejectWithValue("Something went wrong");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);
