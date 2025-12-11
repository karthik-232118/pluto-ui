import { createSlice } from "@reduxjs/toolkit";
import { GetMcqsCreationList, GetMcqsAdd, GetDeleteMcq, GetUpdateMcq } from "./action"; // Import GetDeleteMcq

const mcqcreationlistSlice = createSlice({
  name: "mcqcreationlist",
  initialState: {
    mcqcreationlist: [],
    mcqaddresult: null,
    deleteResult: null,
    updateresult: null, // Add a state to store update result
    loading: false,
    error: null,
  },
  reducers: {
    clearMcqCreationList: (state) => {
      state.mcqcreationlist = [];
    },
    clearMcqAddResult: (state) => {
      state.mcqaddresult = null;
    },
    clearDeleteResult: (state) => {
      state.deleteResult = null;
    },
    clearUpdateResult: (state) => { // Add a reducer to clear update result
      state.updateresult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle McqCreationList API
      .addCase(GetMcqsCreationList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetMcqsCreationList.fulfilled, (state, action) => {
        console.log("GetMcqsCreationList:", action.payload);
        state.loading = false;
        state.mcqcreationlist = action.payload;
      })
      .addCase(GetMcqsCreationList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })

      // Handle McqsAdd API
      .addCase(GetMcqsAdd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetMcqsAdd.fulfilled, (state, action) => {
        console.log("GetMcqsAdd:", action.payload);
        state.loading = false;
        state.mcqaddresult = action.payload;
      })
      .addCase(GetMcqsAdd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })

      // Handle DeleteMcq API
      .addCase(GetDeleteMcq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetDeleteMcq.fulfilled, (state, action) => {
        console.log("GetDeleteMcq:", action.payload);
        state.loading = false;
        state.deleteResult = action.payload;
      })
      .addCase(GetDeleteMcq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })

      // Handle UpdateMcq API
      .addCase(GetUpdateMcq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetUpdateMcq.fulfilled, (state, action) => {
        console.log("GetUpdateMcq:", action.payload);
        state.loading = false;
        state.updateresult = action.payload; // Store the update result
      })
      .addCase(GetUpdateMcq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  },
});


export const { clearMcqCreationList, clearMcqAddResult, clearDeleteResult, clearUpdateResult } = mcqcreationlistSlice.actions; // Export clearUpdateResult
export default mcqcreationlistSlice.reducer;
