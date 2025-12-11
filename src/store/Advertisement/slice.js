import { createSlice } from "@reduxjs/toolkit";
import { GetAdvertisement } from "./action";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const keygenreration = createSlice({
  name: "GetAdvertisement",
  initialState,
  data: {},
  extraReducers: (builder) => {
    builder.addCase(GetAdvertisement.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetAdvertisement.fulfilled, (state, action) => {
      console.log(action.payload)
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(GetAdvertisement.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "An error occurred";
    });
  },
});

export default keygenreration.reducer;
