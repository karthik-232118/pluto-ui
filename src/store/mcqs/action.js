import { createAsyncThunk } from "@reduxjs/toolkit";
import { EndTestApi, TestMcqsListApi } from "../../services/mcqs/Mcqs";
import notify from "../../assets/svg/utils/toast/Toast";

// MCQS List API

export const GetTestMcqsList = createAsyncThunk(
  "GetTestMcqsList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await TestMcqsListApi(data);
      if (response?.status === 200) {
        return response?.data;
      } else {
        // Show error message from API response if available
        if (response?.data?.error) {
          notify("error", response.data.error);
        } else {
          notify("error", "Something went wrong");
        }
        return rejectWithValue(response?.data);
      }
    } catch (error) {
      // Show error message from error response if available
      if (error?.response?.data?.error) {
        notify("error", error.response.data.error);
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const GetEndTest = createAsyncThunk(
  "GetEndTest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await EndTestApi(data);
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
