import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requestBody: null,  // We'll store the final requestBody here
};

const testMcqSlice = createSlice({
  name: "testMcq",
  initialState,
  reducers: {
    setRequestBody: (state, action) => {
      state.requestBody = action.payload;
    },
  },
});

export const { setRequestBody } = testMcqSlice.actions;

export default testMcqSlice.reducer;
