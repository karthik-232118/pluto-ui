// redux/slices/rolesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rolesData: [], // Array to store all NodeIdRoles and their selected roles
};

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    setRolesData: (state, action) => {
      // Add the new roles data to the state array
      state.rolesData.push(action.payload);
    },
    clearRolesData: (state) => {
      state.rolesData = []; // Clear the data if needed
    },  
  },
});

export const { setRolesData, clearRolesData } = rolesSlice.actions;
export default rolesSlice.reducer;
