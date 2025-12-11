import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ModuleTypeID: null,
  ContentID: null,
  SOPID: null, // Add SOPID to the initial state
  SOPName: "",
  SOPIsActive: false,
  SelfApproved: false,
  SOPOwner: [],
  IsTemplate: false,
};

const SOPflowModalSlice = createSlice({
  name: "SOPflowModal",
  initialState,
  reducers: {
    setSOPflowModalData: (state, action) => {
      // Use the payload keys directly without altering their case
      Object.assign(state, action.payload);
    },
  },
});

export const { setSOPflowModalData } = SOPflowModalSlice.actions;
export default SOPflowModalSlice.reducer;
