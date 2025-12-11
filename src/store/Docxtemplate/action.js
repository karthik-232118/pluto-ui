import { createAsyncThunk } from "@reduxjs/toolkit";
import notify from "../../assets/svg/utils/toast/Toast";
import { fetchDocxTemplateAPI } from "../../services/documentModules/DocumentsModule";



// documentModule?.fetch_docx_template_API

// action.js
export const FetchDocxTemplateAPI = createAsyncThunk(
  "FetchDocxTemplateAPI",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching DOCX template...");
      const response = await fetchDocxTemplateAPI();
      console.log("API Response:", response);
      
      if (response?.status === 200) {
        console.log("API Success - Data:", response?.data);
        return response?.data;
      } else {
        console.log("API responded with non-200 status:", response?.status);
        return rejectWithValue(response?.data || "Something went wrong");
      }
    } catch (error) {
      console.error("API Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);