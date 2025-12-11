// selectedIdSlice.js
import { createSlice } from "@reduxjs/toolkit";

const selectedIdSlice = createSlice({
  name: "selectedId",
  initialState: { value: null },
  reducers: {
    setSelectedId(state, action) {
      state.value = action.payload;
    },
    clearSelectedId(state) {
      state.value = null; // Clear the stored ID
    },
  },
});

export const { setSelectedId, clearSelectedId } = selectedIdSlice.actions;
export default selectedIdSlice.reducer;
