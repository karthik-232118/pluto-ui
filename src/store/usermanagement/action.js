import { createAsyncThunk } from "@reduxjs/toolkit";
import notify from "../../assets/svg/utils/toast/Toast";
import {
  getalluserApi,
  deleteuserApi,
  updateuserApi,
  SearchUserApi,
  AddUserApi,
  AddBulkUserApi,
} from "../../services/usermanagement/UserManagement";
import i18next from "i18next";

// getalluserApi

const handleError = (error) => {
  const message = error?.response?.data?.message || "An error occurred";
  notify("error", message);
  return Promise.reject(message);
};

const handleResponse = (response, successMessage) => {
  if (response?.status >= 200 && response?.status < 300) {
    notify("success", successMessage);
    return true;
  } else {
    notify(
      "error",
      response?.data?.message.replace(/[^\w\s]/gi, " ") ||
        response.response?.data?.error.replace(/[^\w\s]/gi, " ")
    );
    return false;
  }
};

// GetAllUserApi
export const GetAllUserApi = createAsyncThunk(
  "getalluser/fetch",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getalluserApi(data);
      if (response?.status === 200) {
        console.log("API Response:", response.data); // Log the response data here
        return response.data;
      } else {
        // notify("error", "Something went wrong");
        return rejectWithValue("Something went wrong");
      }
    } catch (error) {
      console.log("API Error:", error); // Log any errors here
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);
// GetUpdateUserApi
export const GetUpdateUserApi = createAsyncThunk(
  "getupdateuser/fetch",
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateuserApi(data);
      console.log("API Response:", response); // Log the API response
      if (response?.status === 200) {
        return response?.data;
      } else {
        notify(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
        return rejectWithValue("Something went wrong");
      }
    } catch (error) {
      console.error("Error updating user:", error); // Log any errors
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// search_user

export const GetSearchUser = createAsyncThunk(
  "GetSearchUser/fetch",
  async (data, { rejectWithValue }) => {
    try {
      const response = await SearchUserApi(data);
      if (response?.status === 200) {
        return response?.data;
      } else {
        notify(
          "error",
          error?.response?.data?.message || "Something went wrong"
        );
        return rejectWithValue("Something went wrong");
      }
    } catch (error) {
      console.error("Error updating user:", error); // Log any errors
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// deletUser
export const deletUser = createAsyncThunk(
  "enterprise/deleteRole",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await deleteuserApi(data);
      if (response?.status === 200) {
        notify("success", i18next.t("user_deleted_from_enterprise") || response.data.message);
        await dispatch(GetAllUserApi()); // Fetch updated roles
        return data; // Return the deleted role ID for further processing
      }
      // notify("error", response.data.message);
    } catch (error) {
      return handleError(error);
    }
  }
);

// AddUserApi

export const GetAddUser = createAsyncThunk(
  "getadduser/fetch",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AddUserApi(data);
      // Check if the response status is 200 and response data exists
      if (response?.status === 200) {
        return response?.data;
      } else {
        // If response status is not 200, handle it as an error
        return rejectWithValue(
          response?.data?.message ||
            response?.data?.error ||
            "Failed to add user"
        );
      }
    } catch (error) {
      // Handle the error response gracefully
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          error?.error ||
          "Something went wrong"
      );
    }
  }
);

export const AddBulkUser = createAsyncThunk(
  "getadduser/fetch",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AddBulkUserApi(data);
      // Check if the response status is 200 and response data exists
      if (response?.status === 201) {
        return response.data;
      } else {
        // If response status is not 200, handle it as an error
        return rejectWithValue(response?.data?.message || "Failed to add user");
      }
    } catch (error) {
      // Handle the error response gracefully
      return rejectWithValue(error?.response);
    }
  }
);
