import { createAsyncThunk } from "@reduxjs/toolkit";
import notify from "../../assets/svg/utils/toast/Toast";
import { AttemptsApi } from "../../services/attempts/Attempts";



// Attempts Api

export const GetAttempts = createAsyncThunk(
  "GetAttempts",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AttemptsApi(data);
      if (response?.status === 200) {
        return response?.data;
        // notify("error", "Something went wrong");
      } else {
        // notify("error", "Something went wrong");
        return rejectWithValue("Failed to fetch favourites");
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data || "An error occurred");
    }
  }
);
export const IAcknowledge = createAsyncThunk(
  "GetAttempts",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AttemptsApi(data);

      // If the response status is 200, return the data
      if (response?.status === 201) {
        notify("success", response?.data?.message || "Operation successful");
        return response?.data;
      } else {
        // If response status is not 200, reject with error message
        notify("error", response?.data?.error || "Something went wrong");
        return rejectWithValue(response?.data?.error || "Unknown error");
      }
    } catch (error) {
      // In case of an error during the API call (e.g., network issue), notify the user
      const errorMessage = error?.response?.data || error.message || "An error occurred";
      notify("error", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);