import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  DashboardApi,
  LeaderboardData,
  LeaderboardToggleData,
  ProcessOwnerDashboardApi,
  ProcessOwnerDepartmentApi,
  GetDashboardAdminApi,
  GetDashboardElementDetailsApi,
  GetDynamicDashboardApi,
  // MyRequestApi
} from "../../services/dashboard/dashboard";

// Attempts Api

export const GetDashboard = createAsyncThunk(
  "GetDashboard",
  async (data, { rejectWithValue }) => {
    try {
      const response = await DashboardApi(data);
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

// LeaderboardToggleData
export const GetLeaderboard = createAsyncThunk(
  "GetLeaderboard",
  async (data, { rejectWithValue }) => {
    try {
      const response = await LeaderboardToggleData(data);
      if (response?.status === 200) {
        return response?.data;
      } else {
        return rejectWithValue("Failed to fetch leaderboard data");
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data || "An error occurred");
    }
  }
);

// LeaderboardData
export const GetLeaderboardData = createAsyncThunk(
  "GetLeaderboardData",
  async (data, { rejectWithValue }) => {
    try {
      const response = await LeaderboardData(data);
      if (response?.status === 200) {
        return response?.data;
      } else {
        return rejectWithValue("Failed to fetch leaderboard data");
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data || "An error occurred");
    }
  }
);

export const GetDashboardProcessOwner = createAsyncThunk(
  "GetDashboard",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ProcessOwnerDashboardApi(data);
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

export const GetDashboardAdmin = createAsyncThunk(
  "GetDashboard",
  async (data, { rejectWithValue }) => {
    try {
      const response = await GetDashboardAdminApi(data);
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

export const DepartmentOverwiew = createAsyncThunk(
  "DepartmentOverwiew",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ProcessOwnerDepartmentApi(data);
      if (response?.status === 200) {
        return response?.data;
      } else {
        return rejectWithValue("Failed to fetch leaderboard data");
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data || "An error occurred");
    }
  }

     
);

// GetDashboardElementDetailsApi

export const GetDashboardElementDetails = createAsyncThunk(
  "GetDashboardElementDetails",
  async (data, { rejectWithValue }) => {
    try {
      const response = await GetDashboardElementDetailsApi(data);
      if (response?.status === 200) {
        return response?.data;
      } else {
        return rejectWithValue("Failed to fetch leaderboard data");
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data || "An error occurred");
    }
  }
);

// GetDynamicDashboardApi

export const GetDynamicDashboard = createAsyncThunk(
  "GetDynamicDashboard",
  async (data, { rejectWithValue }) => {
    try {
      const response = await GetDynamicDashboardApi(data);
      if (response?.status === 200) {
        return response?.data;
      } else {
        return rejectWithValue("Failed to fetch leaderboard data");
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data || "An error occurred");
    }
  }
);
