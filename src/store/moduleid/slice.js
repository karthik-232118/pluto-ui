import { createSlice } from "@reduxjs/toolkit";
const moduleSlice = createSlice({
    name: "module",
    initialState: {
      moduleTypeID: null,  // Default state
    },
    reducers: {
      setModuleTypeID: (state, action) => {
        state.moduleTypeID = action.payload;  // Set ModuleTypeID
      },
    },
  });
  
  export const { setModuleTypeID } = moduleSlice.actions;
  export default moduleSlice.reducer;
  