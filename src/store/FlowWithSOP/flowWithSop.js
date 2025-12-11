// reducers/index.js
import { createSlice, combineReducers } from "@reduxjs/toolkit";

// Combined initial state
const initialState = {
  rolesData: {},
  // selectedNode: {
  //   id: null,
  //   configData: {},
  // },
  selectedLinks: {},
  selectedNode: [],
  selectedImage: {},
  isWorkflowEnabled: false,
  SOPflowModal: {
    ModuleTypeID: null,
    ContentID: null,
    SOPID: null,
    SOPName: "",
    SOPIsActive: false,
    SelfApproved: false,
    SOPOwner: [],
    IsTemplate: false,
  },
};

// Create slice with combined initial state
const combinedSlice = createSlice({
  name: "appState",
  initialState,
  reducers: {
    setRolesData: (state, action) => {
      const { id, value } = action.payload;
      const allData = state.rolesData;
      allData[id] = value;
      state.rolesData = allData;
    },
    clearRolesData: (state) => {
      state.rolesData = [];
    },
    setSelectedNodeId: (state, action) => {
      state.selectedNode.id = action.payload;
    },
    updateConfigData: (state, action) => {
      const { id, value } = action.payload;
      state.selectedNode.configData[id] = value;
    },
    updateConfig: (state, action) => {
      state.selectedNode.configData = action.payload;
    },
    setSOPflowModalData: (state, action) => {
      Object.assign(state.SOPflowModal, action.payload);
    },
    setSelectedLinks(state, action) {
      const { id, value } = action.payload;
      const allData = state.selectedLinks;
      allData[id] = value;
      state.selectedLinks = allData;
    },
    setSelectedImage(state, action) {
      const { id, value } = action.payload;
      const allData = state.selectedImage;
      allData[id] = value;
      state.selectedImage = allData;
    },
    setIsWorkflowEnabled(state, action) {
      state.isWorkflowEnabled = action.payload;
    },
  },
});

// Export actions for dispatching
export const {
  setRolesData,
  clearRolesData,
  setSelectedNodeId,
  updateConfigData,
  updateConfig,
  setSOPflowModalData,
  setIsWorkflowEnabled,
  setSelectedLinks,
  setSelectedImage,
} = combinedSlice.actions;

// Export the combined reducer
export default combinedSlice.reducer;
