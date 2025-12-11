import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  ActivityAddCommentApi,
  ActivitySidebarApi,
} from "../../services/activitysidebar/ActivitySidebar";
import notify from "../../assets/svg/utils/toast/Toast";
// import notify from "../../assets/svg/utils/toast/Toast";

// ActivitySidebarApi

export const GetActivitySidebar = createAsyncThunk(
  "GetActivitySidebar",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ActivitySidebarApi(data);
      if (response?.status === 200) {
        return response?.data;
      } else {
        // notify('error', 'Something went wrong')
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ActivityAddCommentApi
export const GetActivityAddComment = createAsyncThunk(
  "GetActivityAddComment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ActivityAddCommentApi(data);
      if (response?.status === 200) {
        return response?.data;
      } else {
        // If the API returns an error message, show it in notify and reject
        notify("error", response?.data?.message || "Something went wrong");
        return rejectWithValue(
          response?.data?.message || "Something went wrong"
        );
      }
    } catch (error) {
      // Show error message in notify if available
      const msg =
        error?.response?.data?.message ||
        "failed to add comment, please try again";
      notify("error", msg);
      return rejectWithValue(msg);
    }
  }
);
