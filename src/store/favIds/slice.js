import { createSlice } from '@reduxjs/toolkit';

const idsSlice = createSlice({
  name: 'ids',
  initialState: {
    documentIDs: [],
    sopIDs: [],
    testSimulationIDs: [],
    testMCQIDs: [], // Plural to indicate it's an array
    trainingSimulationIDs: [], // Plural as well
  },
  reducers: {
    setIDs: (state, action) => {
      state.documentIDs = action.payload.documentIDs || [];
      state.sopIDs = action.payload.sopIDs || [];
      state.testSimulationIDs = action.payload.testSimulationIDs || [];
      state.testMCQIDs = action.payload.testMCQIDs || []; // Updated
      state.trainingSimulationIDs = action.payload.trainingSimulationIDs || []; // Updated
    }
  }
});

export const { setIDs } = idsSlice.actions;
export default idsSlice.reducer;
