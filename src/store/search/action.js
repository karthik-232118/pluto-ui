import { createAsyncThunk } from "@reduxjs/toolkit";
import notify from "../../assets/svg/utils/toast/Toast";
import { GlobalSearchApi } from "../../services/globalsearch/GlobalSearch";

// GlobalSearch  API

export const GetGlobalSearch = createAsyncThunk(
  "GetGlobalSearch",
  async (data, { rejectWithValue }) => {
    try {
      const response = await GlobalSearchApi(data);
      if(response?.status === 200){
        return response?.data;
      }else{
        // notify('error', 'Something went wrong')
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
