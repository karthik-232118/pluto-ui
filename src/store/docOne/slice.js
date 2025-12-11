import { createSlice } from "@reduxjs/toolkit";
import { GetDocOne } from "./action";

const docOneSlice = createSlice({
  name: "docOne",
  initialState: {
    DocOne: [],  
    count: 0, 
    loading: false, 
    error: null,  
  },
  reducers: {
    clear: (state) => {
      state.DocOne = [];
      state.count = 0;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetDocOne.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetDocOne.fulfilled, (state, action) => {
        console.log("Data Fetched Successfully:", action.payload);
        state.loading = false;
        state.DocOne = action.payload?.data || []; // Ensure safe data handling
        state.count = action.payload?.count || 0; 
      })
      .addCase(GetDocOne.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  },
});

export const { clear } = docOneSlice.actions;
export default docOneSlice.reducer;
