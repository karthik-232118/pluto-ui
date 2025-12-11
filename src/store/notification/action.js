// store/notification/action.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { NotificationApi } from "../../services/notification/notification";

export const GetNotification = createAsyncThunk(
  "notification/fetch",
  async (data, { rejectWithValue }) => {
    try {
      const response = await NotificationApi(data);
      if (response?.status === 200) {
        return response.data.data; // Return only the `data` array
      } else {
        return rejectWithValue("Error fetching notifications");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Network error");
    }
  }
);
