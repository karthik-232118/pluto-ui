import { createAsyncThunk } from "@reduxjs/toolkit";
import notify from "../../assets/svg/utils/toast/Toast";
import { AccessTokenApi, LoginApi } from "../../services/auth/Auth";

// Favourites API

export const Login = createAsyncThunk(
  "Login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AccessTokenApi(data);
      if (response?.status === 200) {
        return response?.data;
      } else {
        return rejectWithValue("Failed to fetch favourites");
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data || "An error occurred");
    }
  }
);

export const LoginAPI = createAsyncThunk(
  "Login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await LoginApi(data);
      if (response?.status === 200) {
        return response?.data?.data;
      } else {
        return rejectWithValue("Failed to fetch favourites");
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data || "An error occurred");
    }
  }
);