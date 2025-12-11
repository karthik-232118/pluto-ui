// sopSlice.js

import { createSlice } from '@reduxjs/toolkit';

const sopSlice = createSlice({
  name: 'sop',
  initialState: {
    sopId: null,
  },
  reducers: {
    setSopId: (state, action) => {
      state.sopId = action.payload;
    },
  },
});

export const { setSopId } = sopSlice.actions;
export default sopSlice.reducer;
