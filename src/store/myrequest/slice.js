import { createSlice } from "@reduxjs/toolkit";
import { GetMyrequest } from "./action"; // Import GetLeaderboardData

// dashboardSlice

const myRequestSlice = createSlice({
  name: "dashboard",
  initialState: {
    dashboard: [], // Holds the dashboard data
    leaderboard: [], // Holds the leaderboard toggle data
    leaderboardData: [], // Holds the detailed leaderboard data
    loading: false, // Tracks loading state
    error: null, // Tracks any errors
    departmentOverview: [],
    departmentloading: false,
    getmyrequest: [],
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

      .addCase(GetMyrequest.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error when new request starts
      })
      .addCase(GetMyrequest.fulfilled, (state, action) => {
        state.loading = false;
        state.getmyrequest = action.payload; // Store the result in leaderboardData
      })
      .addCase(GetMyrequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred"; // Set error message
      });
  },
});

export const { clearDashboard, clearLeaderboard, clearLeaderboardData } =
  myRequestSlice.actions; // Export the actions
export default myRequestSlice.reducer;
