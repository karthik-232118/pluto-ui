import { createSlice } from "@reduxjs/toolkit";
import { GetFormsList, GetCampList, GetBulkEmailReports } from "./action";

const initialState = {
  loading: false,
  error: null,
  data: null,
  camplist: null,
  emailReports: null,
};

const enterprise = createSlice({
  name: "esign",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetFormsList.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetFormsList.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(GetFormsList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(GetCampList.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetCampList.fulfilled, (state, action) => {
      state.loading = false;
      state.camplist = action.payload;
    });
    builder.addCase(GetCampList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(GetBulkEmailReports.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetBulkEmailReports.fulfilled, (state, action) => {
      state.loading = false;
      state.emailReports = action.payload;
    });
    builder.addCase(GetBulkEmailReports.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default enterprise.reducer;
