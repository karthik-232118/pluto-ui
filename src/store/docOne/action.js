import { createAsyncThunk } from "@reduxjs/toolkit";
import { DocOneAPI } from "../../services/docOne/DocOne";

// GetDocOne
export const GetDocOne = createAsyncThunk(
  "docOne/fetch",
  async (data, { rejectWithValue }) => {
    try {
      const response = await DocOneAPI(data);
      if (response?.status === 200) {
        return response.data; // Ensure returning only necessary data
      } else {
        return rejectWithValue("Something went wrong");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);
