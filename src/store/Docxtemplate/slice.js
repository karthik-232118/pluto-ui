import { FetchDocxTemplateAPI } from "./action";
import { createSlice } from "@reduxjs/toolkit";

const docxTemplateSlice = createSlice({
  name: "DocxTemplate",
  initialState: {
    templates: [],  
    loading: false, 
    error: null,  
    endTestResult: null, 
  },
  reducers: {
    clear: (state) => {
      state.templates = [];  
    },
  },
// slice.js
extraReducers: (builder) => {
  builder
    .addCase(FetchDocxTemplateAPI.pending, (state) => {
      console.log("FetchDocxTemplateAPI pending");
      state.loading = true;
      state.error = null;
    })
    .addCase(FetchDocxTemplateAPI.fulfilled, (state, action) => {
      console.log("FetchDocxTemplateAPI fulfilled - Payload:", action.payload);
      state.loading = false;
      state.templates = action.payload;
    })
    .addCase(FetchDocxTemplateAPI.rejected, (state, action) => {
      console.log("FetchDocxTemplateAPI rejected - Error:", action.error);
      state.loading = false;
      state.error = action.error?.message || "An error occurred";
    });
},
});

export const { clear } = docxTemplateSlice.actions; 
export default docxTemplateSlice.reducer;
