import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  ApiServiceFlow,
  FileUploadService,
} from "../../config/flowAPiServices";
import { ENDPOINT_URL } from "../../config/urlConfig";
import notify from "../../assets/svg/utils/toast/Toast";
import { ApiService } from "../../config/apiServices";

export const openSidbar = createAsyncThunk(
  "data/openSidbar",
  async (isOpen, { rejectWithValue }) => {
    try {
      // Simulating an async process (e.g., API call or local logic)
      console.log(isOpen);
      return isOpen; // Payload to be returned (true or false)
    } catch (error) {
      return rejectWithValue(error.message || "Failed to toggle sidebar");
    }
  }
);

export const UpdateNodeData = createAsyncThunk(
  "data/UpdateNodeData",
  async (data, { rejectWithValue }) => {
    try {
      return data; // Payload to be returned (true or false)
    } catch (error) {
      return rejectWithValue(error.message || "Failed to toggle sidebar");
    }
  }
);

export const GetflowList = createAsyncThunk(
  "data/GetflowList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiServiceFlow.post(
        ENDPOINT_URL.flow_Digram.flowList,
        data
      );
      if (response?.status === 200) {
        return response?.data; // Successfully fetched data
      } else {
        // Handle cases where the API returns an error-like response
        return rejectWithValue(
          response?.data?.message || "Failed to fetch flow list"
        );
      }
    } catch (error) {
      // Catch and return errors from the API call
      return rejectWithValue(
        error?.response?.data?.message ||
          "An error occurred while fetching the flow list"
      );
    }
  }
);

export const GetServiceList = createAsyncThunk(
  "data/GetServiceList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ApiServiceFlow.post(
        ENDPOINT_URL.flow_Digram.getservicelist
      );
      console.log(response);
      if (response?.status === 200) {
        return response?.data; // Successfully fetched data
      } else {
        // Handle cases where the API returns an error-like response
        return rejectWithValue(
          response?.data?.message || "Failed to fetch flow list"
        );
      }
    } catch (error) {
      // Catch and return errors from the API call
      return rejectWithValue(
        error?.response?.data?.message ||
          "An error occurred while fetching the flow list"
      );
    }
  }
);

export const CreateFlow = createAsyncThunk(
  "data/addFlow",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await ApiServiceFlow.post(
        ENDPOINT_URL.flow_Digram.addFlow,
        data
      );
      if (response?.status === 201) {
        dispatch(GetflowList());
        return response?.data; // Successfully fetched data
      } else {
        // Handle cases where the API returns an error-like response
        notify("error", response?.data.error);
        return rejectWithValue(
          response?.data?.message || "Failed to fetch flow list"
        );
      }
    } catch (error) {
      // Catch and return errors from the API call
      return rejectWithValue(
        error?.response?.data?.message ||
          "An error occurred while fetching the flow list"
      );
    }
  }
);
export const CopyWorkFlow = createAsyncThunk(
  "data/CopyWorkFlow",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await ApiServiceFlow.post(
        ENDPOINT_URL.flow_Digram.copyWorkFlow,
        data
      );
      if (response?.status === 201) {
        dispatch(GetflowList());
        return response?.data; // Successfully fetched data
      } else {
        // Handle cases where the API returns an error-like response
        notify("error", response?.data.error);
        return rejectWithValue(
          response?.data?.message || "Failed to fetch flow list"
        );
      }
    } catch (error) {
      // Catch and return errors from the API call
      return rejectWithValue(
        error?.response?.data?.message ||
          "An error occurred while fetching the flow list"
      );
    }
  }
);

export const AddFlowDetails = createAsyncThunk(
  "data/AddFlowDetails",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiServiceFlow.post(
        ENDPOINT_URL.flow_Digram.addFlowDetails,
        data
      );
      if (response?.status === 201) {
        // dispatch(GetflowList());
        return response?.data; // Successfully fetched data
      } else {
        // Handle cases where the API returns an error-like response
        return rejectWithValue(
          response?.data?.message || "Failed to fetch flow list"
        );
      }
    } catch (error) {
      // Catch and return errors from the API call
      return rejectWithValue(
        error?.response?.data?.message ||
          "An error occurred while fetching the flow list"
      );
    }
  }
);

export const GettflowById = createAsyncThunk(
  "data/GettflowById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiServiceFlow.post(
        ENDPOINT_URL.flow_Digram.getflowById,
        data
      );
      if (response?.status === 200) {
        // dispatch(GetflowList());
        return response?.data; // Successfully fetched data
      } else {
        // Handle cases where the API returns an error-like response
        return rejectWithValue(
          response?.data?.message || "Failed to fetch flow list"
        );
      }
    } catch (error) {
      // Catch and return errors from the API call
      return rejectWithValue(
        error?.response?.data?.message ||
          "An error occurred while fetching the flow list"
      );
    }
  }
);

export const UpdateFLowEdges = createAsyncThunk(
  "data/UpdateFLowEdges",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiServiceFlow.post(
        ENDPOINT_URL.flow_Digram.updateflowEdges,
        data
      );
      if (response?.status === 200) {
        // dispatch(GetflowList());
        return response?.data; // Successfully fetched data
      } else {
        // Handle cases where the API returns an error-like response
        return rejectWithValue(
          response?.data?.message || "Failed to fetch flow list"
        );
      }
    } catch (error) {
      // Catch and return errors from the API call
      return rejectWithValue(
        error?.response?.data?.message ||
          "An error occurred while fetching the flow list"
      );
    }
  }
);

export const UpdateFLowPosition = createAsyncThunk(
  "data/UpdateFLowPosition",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiServiceFlow.post(
        ENDPOINT_URL.flow_Digram.updateflowPostion,
        data
      );
      if (response?.status === 201) {
        // dispatch(GetflowList());
        notify("success", response?.data);
        return response?.data; // Successfully fetched data
      } else {
        notify("error", response?.data?.message);
        // Handle cases where the API returns an error-like response
        return rejectWithValue(
          response?.data?.message || "Failed to fetch flow list"
        );
      }
    } catch (error) {
      // Catch and return errors from the API call
      return rejectWithValue(
        error?.response?.data?.message ||
          "An error occurred while fetching the flow list"
      );
    }
  }
);

export const UpdateFlowDetails = createAsyncThunk(
  "data/UpdateFlowDetails",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiServiceFlow.post(
        ENDPOINT_URL.flow_Digram.updateFlowDetails,
        data
      );
      if (response?.status === 200) {
        // dispatch(GetflowList());
        return response?.data; // Successfully fetched data
      } else {
        // Handle cases where the API returns an error-like response
        return rejectWithValue(
          response?.data?.message || "Failed to fetch flow list"
        );
      }
    } catch (error) {
      // Catch and return errors from the API call
      return rejectWithValue(
        error?.response?.data?.message ||
          "An error occurred while fetching the flow list"
      );
    }
  }
);
export const ExecuteFlow = createAsyncThunk(
  "data/ExecuteFlow",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiServiceFlow.post(
        ENDPOINT_URL.flow_Digram.executeFlow,
        data
      );
      if (response?.status === 200) {
        // dispatch(GetflowList());

        return response?.data; // Successfully fetched data
      } else {
        // Handle cases where the API returns an error-like response
        return rejectWithValue(
          response?.data?.message || "Failed to fetch flow list"
        );
      }
    } catch (error) {
      // Catch and return errors from the API call
      return rejectWithValue(
        error?.response?.data?.message ||
          "An error occurred while fetching the flow list"
      );
    }
  }
);

export const ExecuteStep = createAsyncThunk(
  "data/ExecuteStep",
  async (data, { rejectWithValue }) => {
    try {
      const response = await FileUploadService.post(
        ENDPOINT_URL.flow_Digram.executeStep,
        data
      );
      if (response?.status === 200) {
        // dispatch(GetflowList());
        notify("success", response?.data.message);

        return true; // Successfully fetched data
      } else {
        // Handle cases where the API returns an error-like response
        return rejectWithValue(
          response?.data?.message || "Failed to fetch flow list"
        );
      }
    } catch (error) {
      // Catch and return errors from the API call
      return rejectWithValue(
        error?.response?.data?.message ||
          "An error occurred while fetching the flow list"
      );
    }
  }
);

export const ExecutionRetry = createAsyncThunk(
  "data/UpdateFlowDetails",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiServiceFlow.post(
        ENDPOINT_URL.flow_Digram.executionRetry,
        data
      );
      if (response?.status === 200) {
        // dispatch(GetflowList());
        notify("success", response?.data.message);

        return response?.data; // Successfully fetched data
      } else {
        // Handle cases where the API returns an error-like response
        notify("info", response?.data.message);
        return rejectWithValue(
          response?.data?.message || "Failed to fetch flow list"
        );
      }
    } catch (error) {
      // Catch and return errors from the API call
      return rejectWithValue(
        error?.response?.data?.message ||
          "An error occurred while fetching the flow list"
      );
    }
  }
);

export const ExecutionHistory = createAsyncThunk(
  "data/ExecutionHistory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiServiceFlow.post(
        ENDPOINT_URL.flow_Digram.executionHistory,
        data
      );
      if (response?.status === 200) {
        // dispatch(GetflowList());
        return response?.data; // Successfully fetched data
      } else {
        // Handle cases where the API returns an error-like response
        return rejectWithValue(
          response?.data?.message || "Failed to fetch flow list"
        );
      }
    } catch (error) {
      // Catch and return errors from the API call
      return rejectWithValue(
        error?.response?.data?.message ||
          "An error occurred while fetching the flow list"
      );
    }
  }
);
export const GetMyWorkFlow = createAsyncThunk(
  "data/ExecutionHistory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiServiceFlow.post(
        ENDPOINT_URL.flow_Digram.executionHistory,
        { UserID: localStorage.getItem("user_id") }
      );
      if (response?.status === 200) {
        // dispatch(GetflowList());
        // console.log(response?.data,"response?.data4es")
        return response?.data; // Successfully fetched data
      } else {
        // Handle cases where the API returns an error-like response
        return rejectWithValue(
          response?.data?.message || "Failed to fetch flow list"
        );
      }
    } catch (error) {
      // Catch and return errors from the API callUpdateExecutionHistory
      return rejectWithValue(
        error?.response?.data?.message ||
          "An error occurred while fetching the flow list"
      );
    }
  }
);
export const GetStepDetails = createAsyncThunk(
  "data/GetStepDetails",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiServiceFlow.post(
        ENDPOINT_URL.flow_Digram.getStepDetails,
        data
      );
      if (response?.status === 200) {
        return response?.data; // Successfully fetched data
      } else {
        return rejectWithValue(
          response?.data?.message || "Failed to fetch flow list"
        );
      }
    } catch (error) {
      // Catch and return errors from the API callUpdateExecutionHistory
      return rejectWithValue(
        error?.response?.data?.message ||
          "An error occurred while fetching the flow list"
      );
    }
  }
);

export const UpdateExecutionHistory = createAsyncThunk(
  "data/UpdateExecutionHistory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiServiceFlow.post(
        ENDPOINT_URL.flow_Digram.updateExecutionHistory,
        data
      );
      if (response?.status === 200) {
        // dispatch(GetflowList());
        return response?.data; // Successfully fetched data
      } else {
        // Handle cases where the API returns an error-like response
        return rejectWithValue(
          response?.data?.message || "Failed to fetch flow list"
        );
      }
    } catch (error) {
      // Catch and return errors from the API call
      return rejectWithValue(
        error?.response?.data?.message ||
          "An error occurred while fetching the flow list"
      );
    }
  }
);

export const GetPerveData = createAsyncThunk(
  "data/GetPerveData",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiServiceFlow.post(
        ENDPOINT_URL.flow_Digram.getprevData,
        data
      );
      if (response?.status === 200) {
        // dispatch(GetflowList());
        return response?.data; // Successfully fetched data
      } else {
        // Handle cases where the API returns an error-like response
        return rejectWithValue(
          response?.data?.message || "Failed to fetch flow list"
        );
      }
    } catch (error) {
      // Catch and return errors from the API call
      return rejectWithValue(
        error?.response?.data?.message ||
          "An error occurred while fetching the flow list"
      );
    }
  }
);

export const GetUserList = createAsyncThunk(
  "data/GetUserList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ApiService.post(
        ENDPOINT_URL.flow_Digram.getUserList,
        data
      );
      if (response?.status === 200) {
        return response?.data;
      } else {
        return rejectWithValue(
          response?.data?.message || "Failed to fetch flow list"
        );
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "An error occurred while fetching the flow list"
      );
    }
  }
);
export const DeleteFlow = createAsyncThunk(
  "data/DeleteFlow",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await ApiServiceFlow.post(
        ENDPOINT_URL.flow_Digram.deleteFlow,
        data
      );
      if (response?.status === 200) {
        dispatch(GetflowList());
        notify("success", response?.data.message);
        return response?.data;
      } else {
        notify("error", response?.data.error);
        return rejectWithValue(
          response?.data?.message || "Failed to delete flow "
        );
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "An error occurred while deleting the flow"
      );
    }
  }
);

export const ExecuteFlowHistoryToGetData = createAsyncThunk(
  "data/ExecuteFlowHistoryToGetData",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await ApiServiceFlow.post(
        ENDPOINT_URL.flow_Digram.executeFlowHistory,
        data
      );
      if (response?.status === 200) {
        // dispatch(GetflowList());
        return response?.data;
      } else {
        return rejectWithValue(
          response?.data?.message || "Failed to delete flow "
        );
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "An error occurred while deleting the flow"
      );
    }
  }
);
