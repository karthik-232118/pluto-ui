import { createSlice } from "@reduxjs/toolkit";
import {
  openSidbar,
  GetflowList,
  GetServiceList,
  GettflowById,
  UpdateNodeData,
  ExecuteFlow,
  ExecutionHistory,
  GetPerveData,
  UpdateExecutionHistory,
  GetUserList,
  ExecuteFlowHistoryToGetData,
  ExecutionRetry,
} from "./action";

// Define the initial state
const initialState = {
  data: {
    open: false,
    name: null,
    id: null,
    openService: false,
  },
  opneReplaceShape: {
    open: false,
    newnode: null,
  },
  getallservices: [],
  getworkflowList: [],
  getflowdatafromId: {},
  historyData: [],
  loading: true,
  error: null,
  nodesData: [],
  propertiesData: {},
  configData: {},
  executeFlowData: null,
  executionHistoryData: [],
  getpervData: null,
  userList: [],
  startNodeId: null,
  exicutionLoading: false,
  executionFlowData: null,
  allNodes: [],
  allEdges: [],
};

const workflowsilce = createSlice({
  name: "data",
  initialState,
  reducers: {
    updatePropsData: (state, action) => {
      const { id, value } = action.payload;
      const allData = state.propertiesData;
      allData[id] = value;
      state.propertiesData = allData;
    },
    updateConfigData: (state, action) => {
      const { id, value } = action.payload;
      const allData = state.configData;
      allData[id] = value;
      state.configData = allData;
    },
    updateConfig: (state, action) => {
      state.configData = action.payload;
    },
    openServiceforShapes: (state, action) => {
      state.opneReplaceShape = action.payload;
    },
    toggelServices: (state, action) => {
      state.loading = false;
      state.data.open = action.payload.open;
      state.data.name = action.payload.name;
      state.data.id = action.payload.id;
      state.data.openService = action.payload.openService;
    },
    updateStartNodeId: (state, action) => {
      state.startNodeId = action.payload;
    },
    UpdateNodesData: (state, action) => {
      state.allNodes = action.payload;
      state.loading = false;
      state.exicutionLoading = false;
    },
    UpdateEdgesData: (state, action) => {
      state.allEdges = action.payload;
      state.loading = false;
      state.exicutionLoading = false;
    },
  }, // Use for synchronous reducers
  extraReducers: (builder) => {
    builder
      .addCase(openSidbar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(openSidbar.fulfilled, (state, action) => {
        state.loading = false;
        state.data.open = action.payload.open; // Update the `open` state
        state.data.name = action.payload.name;
        state.data.id = action.payload.id;
        state.data.openService = action.payload.openService;
      })
      .addCase(openSidbar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
      .addCase(GetflowList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetflowList.fulfilled, (state, action) => {
        state.loading = false;
        state.getworkflowList = action.payload; // Update the `open` state
      })
      .addCase(GetflowList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
      .addCase(GetServiceList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetServiceList.fulfilled, (state, action) => {
        state.loading = false;
        state.getallservices = action.payload; // Update the `open` state
      })
      .addCase(GetServiceList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
      // GettflowById

      .addCase(GettflowById.pending, (state) => {
        state.exicutionLoading = true;
        state.error = null;
        state.getflowdatafromId = {};
      })
      .addCase(GettflowById.fulfilled, (state, action) => {
        state.exicutionLoading = false;
        state.getflowdatafromId = action.payload; // Update the `open` state
      })
      .addCase(GettflowById.rejected, (state, action) => {
        state.exicutionLoading = false;
        state.error = action.payload || "An error occurred";
      })

      .addCase(UpdateNodeData.pending, (state) => {
        state.exicutionLoading = true;
        state.error = null;
      })
      .addCase(UpdateNodeData.fulfilled, (state, action) => {
        state.loading = false;
        state.nodesData = action.payload; // Update the `open` state
      })
      .addCase(UpdateNodeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
      // ExecuteFlow
      .addCase(ExecuteFlow.pending, (state) => {
        state.exicutionLoading = true;
        state.error = null;
      })
      .addCase(ExecuteFlow.fulfilled, (state, action) => {
        state.exicutionLoading = false;
        state.executeFlowData = action.payload; // Update the `open` state
      })
      .addCase(ExecuteFlow.rejected, (state, action) => {
        state.exicutionLoading = false;
        state.error = action.payload || "An error occurred";
      })
      .addCase(ExecutionHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ExecutionHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.executionHistoryData = action.payload; // Update the `open` state
      })
      .addCase(ExecutionHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })

      // GetPerveData
      .addCase(GetPerveData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetPerveData.fulfilled, (state, action) => {
        state.loading = false;
        state.getpervData = action.payload; // Update the `open` state
      })
      .addCase(GetPerveData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
      .addCase(UpdateExecutionHistory.pending, (state) => {
        state.exicutionLoading = true;
        state.error = null;
      })
      .addCase(UpdateExecutionHistory.fulfilled, (state, action) => {
        state.exicutionLoading = false;
        state.getflowdatafromId = action.payload.executionFlow.Flow; // Update the `open` state
        state.executeFlowData = action.payload; // Update the `open` state
      })
      .addCase(UpdateExecutionHistory.rejected, (state, action) => {
        state.exicutionLoading = false;
        state.error = action.payload || "An error occurred";
      })
      // GetUserList
      .addCase(GetUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = action.payload.data; // Update the `open` state
      })
      .addCase(GetUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })

      // ExecuteFlowHistoryToGetData
      .addCase(ExecuteFlowHistoryToGetData.pending, (state) => {
        state.exicutionLoading = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(ExecuteFlowHistoryToGetData.fulfilled, (state, action) => {
        state.exicutionLoading = false;
        state.loading = false;
        state.executionFlowData = action.payload; // Update the `open` state
        state.getflowdatafromId = {}; // Update the `open` state
      })
      .addCase(ExecuteFlowHistoryToGetData.rejected, (state, action) => {
        state.exicutionLoading = false;
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
      //ExecutionRetry
      .addCase(ExecutionRetry.pending, (state) => {
        state.exicutionLoading = true;
        state.error = null;
      })
      .addCase(ExecutionRetry.fulfilled, (state, action) => {
        state.exicutionLoading = false;
        // state.executeFlowData = action.payload; // Update the `open` state
      })
      .addCase(ExecutionRetry.rejected, (state, action) => {
        state.exicutionLoading = false;
        state.error = action.payload || "An error occurred";
      });
  },
});
export const {
  updatePropsData,
  updateConfigData,
  updateConfig,
  openServiceforShapes,
  toggelServices,
  updateStartNodeId,
  UpdateNodesData,
  UpdateEdgesData,
} = workflowsilce.actions;
export default workflowsilce.reducer;
