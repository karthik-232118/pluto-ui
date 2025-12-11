// store/selectedNodeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const selectedNodeSlice = createSlice({
  name: "selectedNode",
  initialState: {
    id: null,
  },
  reducers: {
    setSelectedNodeId: (state, action) => {
      state.id = action.payload;
    },
  },
});

export const { setSelectedNodeId, updateConfigNode } =
  selectedNodeSlice.actions;
export default selectedNodeSlice.reducer;
