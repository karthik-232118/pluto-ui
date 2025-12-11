import { GetEndTest, GetTestMcqsList } from "./action";
import { createSlice } from "@reduxjs/toolkit";

const mcqsSlice = createSlice({
  name: "mcqs",
  initialState: {
    mcqsList: [],
    loading: false,
    error: null,
    endTestResult: null,
  },
  reducers: {
    clearMcqsList: (state) => {
      state.mcqsList = [];
    },
  },
  extraReducers: (builder) => {
    builder;
    builder.addCase(GetTestMcqsList.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetTestMcqsList.fulfilled, (state, action) => {
      console.log("GetTestMcqsList :", action.payload);
      state.loading = false;
      state.GetTestMcqsList = action.payload;
      console.log(GetTestMcqsList, "GetTestMcqsList");
    });
    builder.addCase(GetTestMcqsList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "An error occurred";
    });

    // EndTest API

    builder.addCase(GetEndTest.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetEndTest.fulfilled, (state, action) => {
      state.loading = false;
      state.endTestResult = action.payload?.data;
    });
    builder.addCase(GetEndTest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "An error occurred";
    });
  },
});

export const { clearMcqsList } = mcqsSlice.actions;

export default mcqsSlice.reducer;
