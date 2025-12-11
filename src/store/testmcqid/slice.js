// src/store/testSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  TestMCQID: null,
};

const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    setTestMCQID(state, action) {
      state.TestMCQID = action.payload;
    },
    clearTestMCQID(state) {
      state.TestMCQID = null;
    },
  },
});

export const { setTestMCQID, clearTestMCQID } = testSlice.actions;

export default testSlice.reducer;
