// Import createAsyncThunk
import { createAsyncThunk } from "@reduxjs/toolkit";
import notify from "../../assets/svg/utils/toast/Toast";
import { getalluserApi } from "../../services/usermanagement/UserManagement";

// Define the async action to fetch all users
export const GetAllUserApi = createAsyncThunk(
  "getalluser/fetch",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getalluserApi(data);
      console.log("API Response:", response); // Log the API response
      if (response?.status === 200) {
        return response?.data;
      } else {
        // notify("error", error?.response?.data?.message || "Something went wrong");
        return rejectWithValue("Something went wrong");
      }
    } catch (error) {
      console.error("Error fetching users:", error); // Log any errors
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// Create a slice for handling the state
import { createSlice } from "@reduxjs/toolkit";
import { GetAddUser, GetSearchUser, GetUpdateUserApi } from "./action";

const getalluserSlice = createSlice({
  name: "getalluser",
  initialState: {
    getalluser: [],  // Holds the list of users
    searchResults: [],  // Holds the search results
    loading: false,  // Tracks loading state
    error: null,     // Tracks any errors
  },
  reducers: {
    clear: (state) => {
      state.getalluser = [];  // Clear the user data
      state.searchResults = []; // Clear the search results
    },
  },
  extraReducers: (builder) => {
    builder
      // GetAllUserApi cases
      .addCase(GetAllUserApi.pending, (state) => {
        console.log("Fetching users...");
        state.loading = true;
        state.error = null;
      })
      .addCase(GetAllUserApi.fulfilled, (state, action) => {
        console.log("Users fetched successfully:", action.payload);
        state.loading = false;
        state.getalluser = action.payload;
      })
      .addCase(GetAllUserApi.rejected, (state, action) => {
        console.error("Failed to fetch users:", action.payload);
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
  
      // GetUpdateUserApi cases
      .addCase(GetUpdateUserApi.pending, (state) => {
        console.log("Updating user...");
        state.loading = true;
        state.error = null;
      })
      .addCase(GetUpdateUserApi.fulfilled, (state, action) => {
        console.log("User updated successfully:", action.payload);
        state.loading = false;
        const updatedUser = action.payload;
        state.getalluser = state.getalluser.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
      })
      .addCase(GetUpdateUserApi.rejected, (state, action) => {
        console.error("Failed to update user:", action.payload);
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
  
      // GetSearchUser cases
      .addCase(GetSearchUser.pending, (state) => {
        console.log("Searching users...");
        state.loading = true;
        state.error = null;
      })
      .addCase(GetSearchUser.fulfilled, (state, action) => {
        console.log("Users searched successfully:", action.payload);
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(GetSearchUser.rejected, (state, action) => {
        console.error("Failed to search users:", action.payload);
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
  
      // GetAddUser cases
      .addCase(GetAddUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetAddUser.fulfilled, (state, action) => {       
        state.loading = false;
        state.getalluser = [...state.getalluser, action.payload]; // Add the new user to the list
      })
      .addCase(GetAddUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  },
  
});

// Export actions and reducer
export const { clear } = getalluserSlice.actions;
export default getalluserSlice.reducer;