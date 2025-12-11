import { createSlice } from "@reduxjs/toolkit";

// Initial state for the slice
const initialState = {
  actionData: null,
};

// Create a slice for storing the action data
const actionSlice = createSlice({
  name: "action",
  initialState,
  reducers: {
    setActionData: (state, action) => {
      state.actionData = action.payload; // Store the action data in the state
    },
    clearActionData: (state) => {
      state.actionData = null; // Clear the action data
    },
  },
});

// Export the actions
export const { setActionData, clearActionData } = actionSlice.actions;

// Export the reducer to add to the store
export default actionSlice.reducer;
