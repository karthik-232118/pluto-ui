// ElementsFolderFileApi
import { createAsyncThunk } from "@reduxjs/toolkit";
import notify from "../../assets/svg/utils/toast/Toast";
import {
  ChangePaswdataApi,
  getuserdataApi,
  UpdateNotificationApi,
  updateuserdataApi,
} from "../../services/user/user";
import i18next from "i18next";

export const GetUserdata = createAsyncThunk(
  "GetUserdata",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getuserdataApi();
      if (response?.status === 200) {
        return response?.data?.data;
      } else {
        // notify('error', 'Something went wrong')
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const UpdateUserData = createAsyncThunk(
  "user/updateUserdata",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await updateuserdataApi(userData); // Make sure to create this API function
      if (response?.status === 200) {
        dispatch(GetUserdata());
        notify("success");
        return response.data.data; // Adjust based on your API response structure
      } else {
        notify("error", response.data.error);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const ChangePasowrd = createAsyncThunk(
  "user/ChangePasowrd",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await ChangePaswdataApi(userData);
      if (response?.status === 200) {
        notify(
          "success",
          i18next.t("User Password updated successfully") ||
            response.data.message
        );
        dispatch(GetUserdata());
        return response.data.data;
      } else {
        notify("error", response.data.error);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);
export const UpdateNotification = createAsyncThunk(
  "user/UpdateNotification",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await UpdateNotificationApi(userData);
      if (response?.status === 200) {
        dispatch(GetUserdata());
        notify(
          "success",
          i18next.t("User Notification Configuration updated successfully") ||
            response.data.message
        );
        return response.data.data;
      } else {
        notify("error", response.data.error);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);
