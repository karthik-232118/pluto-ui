import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  CreateSOPReactFlow,
  ViewSOPReactFlow,
} from "../../services/SOPReactFlow/SOPReactFlow";
import notify from "../../assets/svg/utils/toast/Toast";

// CreateSOPReactFlow
export const GetCreateSOPReactFlow = createAsyncThunk(
  "SOPReactFlow/create", // Updated action type
  async (data, { rejectWithValue }) => {
    try {
      const response = await CreateSOPReactFlow(data);
      if (response?.status === 201) {
        notify("success", response.data.message);
        return response.data.data;
      } else {
        notify("error", response.data.message);
        return rejectWithValue("Error fetching SOP React Flow data");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Network error");
    }
  }
);

// ViewSOPReactFlow

export const GetViewSOPReactFlow = createAsyncThunk(
  "SOPReactFlow/view", // Updated action type
  async (data, { rejectWithValue }) => {
    try {
      const response = await ViewSOPReactFlow(data);
      if (response?.status === 200) {
        return response.data.data;
      } else {
        return rejectWithValue("Error fetching SOP React Flow data");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Network error");
    }
  }
);

// UploadImageSOPReactFlow

export const UploadImageSOPReactFlow = createAsyncThunk(
  "SOPReactFlow/uploadImage", // Updated action type
  async (data, { rejectWithValue }) => {
    try {
      const response = await UploadImageSOPReactFlow(data);
      if (response?.status === 200) {
        return response.data.data;
      } else {
        return rejectWithValue("Error fetching SOP React Flow data");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Network error");
    }
  }
);
