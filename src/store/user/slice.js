import { createSlice } from "@reduxjs/toolkit";
import { GetUserdata } from "./user";

const initialState = {
  userdata: {},
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Category files list
    builder.addCase(GetUserdata.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetUserdata.fulfilled, (state, action) => {
      state.loading = false;
      state.userdata = action.payload;
    });
    builder.addCase(GetUserdata.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "An error occurred";
    });
  },
});

export default userSlice.reducer;
