import { createAsyncThunk } from "@reduxjs/toolkit";
import { MoveFileAPI } from "../../services/moveFile/MoveFile";

// MoveFile API call
export const MoveFile = createAsyncThunk(
  "moveFile/moveFile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await MoveFileAPI(data);
      if (response?.status === 200) {
        return response?.data;
      } else {
      
        return rejectWithValue("Something went wrong");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);
