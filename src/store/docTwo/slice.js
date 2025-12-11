import { createSlice } from "@reduxjs/toolkit";
import { GetDocTwo } from "./action";

const docTwoSlice = createSlice({
  name: "docTwo",
  initialState: {
    DocTwo: [],  
    count: 0, 
    loading: false, 
    error: null,  
  },
  reducers: {
    clear: (state) => {
      state.DocTwo = [];
      state.count = 0;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetDocTwo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetDocTwo.fulfilled, (state, action) => {
        console.log("Data Fetched Successfully:", action.payload);
        state.loading = false;
        state.DocTwo = action.payload?.data || []; // Ensure safe data handling
        state.count = action.payload?.count || 0; 
      })
      .addCase(GetDocTwo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  },
});

export const { clear } = docTwoSlice.actions;
export default docTwoSlice.reducer;
