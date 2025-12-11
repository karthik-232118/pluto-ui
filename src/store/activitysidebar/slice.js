// import { createSlice } from "@reduxjs/toolkit";
// import { GetActivitySidebar } from "./action"; // Import the thunk action

// const activitySlice = createSlice({
//   name: "activity",
//   initialState: {
//     activity: [], // Holds the activity data
//     loading: false, // Tracks loading state
//     error: null, // Tracks any errors
//   },
//   reducers: {
//     clear: (state) => {
//       state.activity = []; // Correctly mutates the activity array to clear it
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(GetActivitySidebar.pending, (state) => {
//         state.loading = true;
//         state.error = null; // Clear error when new request starts
//       })
//       .addCase(GetActivitySidebar.fulfilled, (state, action) => {
//         console.log("GetActivitySidebar fulfilled:", action.payload);
//         state.loading = false;
//         state.activity = action.payload; // Store the activity data in `activity`
//       })
//       .addCase(GetActivitySidebar.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "An error occurred"; // Set error message
//       });

      
//   },
// });

// export const { clear } = activitySlice.actions; // Export the `clear` action
// export default activitySlice.reducer; // Export the reducer to add to the store


import { createSlice } from "@reduxjs/toolkit";
import { GetActivitySidebar, GetActivityAddComment } from "./action"; // Import both thunk actions

const activitySlice = createSlice({
  name: "activity",
  initialState: {
    activity: [], // Holds the activity data
    loading: false, // Tracks loading state
    error: null, // Tracks any errors
    commentStatus: false, // Tracks comment submission status
  },
  reducers: {
    clear: (state) => {
      state.activity = []; // Clear the activity array
      state.commentStatus = false; // Reset comment status when clearing
    },
  },
  extraReducers: (builder) => {
    builder
      // Handling GetActivitySidebar API
      .addCase(GetActivitySidebar.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error when new request starts
      })
      .addCase(GetActivitySidebar.fulfilled, (state, action) => {
        console.log("GetActivitySidebar fulfilled:", action.payload);
        state.loading = false;
        state.activity = action.payload; // Store the activity data in `activity`
      })
      .addCase(GetActivitySidebar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred"; // Set error message
      })
      

      
      // Handling GetActivityAddComment API
      .addCase(GetActivityAddComment.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear error when new request starts
      })
      .addCase(GetActivityAddComment.fulfilled, (state, action) => {
        console.log("GetActivityAddComment fulfilled:", action.payload);
        state.loading = false;
        state.commentStatus = true; // Set comment status as successful
      })
      .addCase(GetActivityAddComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred"; // Set error message
        state.commentStatus = false; // Set comment status as failed
      });
  },
});

export const { clear } = activitySlice.actions; // Export the `clear` action
export default activitySlice.reducer; // Export the reducer to add to the store
