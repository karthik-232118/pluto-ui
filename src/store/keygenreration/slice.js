import { createSlice } from "@reduxjs/toolkit";
import { Keygenreation } from "./action";

const initialState = {
  data: {},
  loading: false,
  error: null,
};

const keygenreration = createSlice({
  name: "Keygenreation",
  initialState,
  data: {},
  extraReducers: (builder) => {
    builder.addCase(Keygenreation.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(Keygenreation.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(Keygenreation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "An error occurred";
    });
  },
});

export default keygenreration.reducer;
