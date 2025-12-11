// src/store/mcqtestslice/testSlice.js

import { createSlice } from "@reduxjs/toolkit";

const testSlice = createSlice({
  name: "test",
  initialState: {
    testData: null,
  },
  reducers: {
    setTestData: (state, action) => {
      state.testData = action.payload;
    },
  },
});

export const { setTestData } = testSlice.actions;
export const selectTestData = (state) => state.test.testData;
export default testSlice.reducer;
