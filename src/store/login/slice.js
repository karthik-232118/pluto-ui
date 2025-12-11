import { createSlice } from "@reduxjs/toolkit";
import { Login } from "./action";

const initialState = {
  data: {},
  loading: false,
  error: null,
};

const userAuth = createSlice({
  name: "Login",
  initialState,
  data: {},
  extraReducers: (builder) => {
    builder.addCase(Login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(Login.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(Login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "An error occurred";
    });
  },
});

export default userAuth.reducer;
