import { createAsyncThunk } from "@reduxjs/toolkit";
import { ListRiskAndCompliencesApi } from "../../services/riskandCompliences/RiskandCompliences";

export const GetListRiskAndCompliences = createAsyncThunk(
  "RiskAndCompliences/fetch",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ListRiskAndCompliencesApi(data);
      if (response?.status === 200) {
        return response.data.data; // Return the data array
      } else {
        return rejectWithValue("Error fetching Risk and Compliance data");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Network error");
    }
  }
);
