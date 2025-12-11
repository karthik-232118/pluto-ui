import { createAsyncThunk } from "@reduxjs/toolkit";
import notify from "../../assets/svg/utils/toast/Toast";
import { DeleteMcqApi, McqAddApi, McqCreationListApi, UpdateMcqApi } from "../../services/mcqcreations/McqCreation";



//McqCreationListApi

export const GetMcqsCreationList = createAsyncThunk(
  "mcqcreationlist/getMcqsCreationList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await McqCreationListApi(data);
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


// McqAddApi

export const GetMcqsAdd = createAsyncThunk(
  "mcqadd/GetMcqsAdd",
  async (data, { rejectWithValue }) => {
    try {
      const response = await McqAddApi(data);
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

// DeleteMcqApi

export const GetDeleteMcq = createAsyncThunk(
  "deletemcq/GetDeleteMcq",
  async (data, { rejectWithValue }) => {
    try {
      const response = await DeleteMcqApi(data);
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

// UpdateMcqApi

export const GetUpdateMcq = createAsyncThunk(
  "updatemcq/GetUpdateMcq",
  async (data, { rejectWithValue }) => {
    try {
      const response = await UpdateMcqApi(data);
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