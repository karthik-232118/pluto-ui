// store/notification/slice.js
import { createSlice } from "@reduxjs/toolkit";
import { GetNotification } from "./action";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notification: [],  
    count: 0, 
    loading: false, 
    error: null,  
  },
  reducers: {
    clear: (state) => {
      state.notification = [];
      state.count = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetNotification.fulfilled, (state, action) => {
        console.log("GetNotification fulfilled:", action.payload);
        state.loading = false;
        state.notification = action.payload; // Ensure we're storing `data` array in `notification`
        state.count = action.payload.count || 0;
      })
      .addCase(GetNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  },
});

export const { clear } = notificationSlice.actions;
export default notificationSlice.reducer;
