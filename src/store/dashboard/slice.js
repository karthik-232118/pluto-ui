import { createSlice } from "@reduxjs/toolkit";
import {
  GetDashboard,
  GetLeaderboard,
  GetLeaderboardData,
  DepartmentOverwiew,
  GetDashboardElementDetails,
  GetDynamicDashboard, // Corrected spelling
} from "./action"; // Import GetLeaderboardData

// dashboardSlice

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    dashboard: [], // Holds the dashboard data
    leaderboard: [], // Holds the leaderboard toggle data
    leaderboardData: [], // Holds the detailed leaderboard data
    loading: false, // Tracks loading state
    error: null, // Tracks any errors
    departmentOverview: [],
    elementDetails: [],
    departmentloading: false,
    isLoading: false,
    dynamicDashboardData: null,

    // getmyrequest: [],
  },
  reducers: {
    clearDashboard: (state) => {
      state.dashboard = []; // Clear the dashboard array
    },
    clearLeaderboard: (state) => {
      state.leaderboard = []; // Clear the leaderboard array
    },
    clearLeaderboardData: (state) => {
      state.leaderboardData = []; // Clear the leaderboardData array
    },
  },
  extraReducers: (builder) => {
    builder

      // Handling GetDashboard
      .addCase(GetDashboard.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error when new request starts
      })
      .addCase(GetDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload; // Store the result in dashboard
      })
      .addCase(GetDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred"; // Set error message
      })
      // Handling GetLeaderboard
      .addCase(GetLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error when new request starts
      })
      .addCase(GetLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboard = action.payload; // Store the result in leaderboard
      })
      .addCase(GetLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred"; // Set error message
      })
      // Handling GetLeaderboardData
      .addCase(GetLeaderboardData.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error when new request starts
      })
      .addCase(GetLeaderboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboardData = action.payload; // Store the result in leaderboardData
      })
      .addCase(GetLeaderboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred"; // Set error message
      })
      // Handling DepartmentOverview
      .addCase(DepartmentOverwiew.pending, (state) => {
        state.departmentloading = true;
        state.error = null; // Clear error when new request starts
      })
      .addCase(DepartmentOverwiew.fulfilled, (state, action) => {
        state.departmentloading = false;
        state.departmentOverview = action.payload; // Store the result in leaderboardData
      })
      .addCase(DepartmentOverwiew.rejected, (state, action) => {
        state.departmentloading = false;
        state.error = action.payload || "An error occurred"; // Set error message
      })
      
      //  New cases for GetDashboardElementDetails
      .addCase(GetDashboardElementDetails.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error when new request starts
      })
      .addCase(GetDashboardElementDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.elementDetails = action.payload; // Store the result in elementDetails
      })
      .addCase(GetDashboardElementDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred"; // Set error message
      })

      // GetDynamicDashboard
      .addCase(GetDynamicDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(GetDynamicDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dynamicDashboardData = action.payload;
      })
      .addCase(GetDynamicDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

  },
});

export const { clearDashboard, clearLeaderboard, clearLeaderboardData } =
  dashboardSlice.actions; // Export the actions
export default dashboardSlice.reducer;
