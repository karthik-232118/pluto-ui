import { createAsyncThunk } from "@reduxjs/toolkit";
import notify from "../../assets/svg/utils/toast/Toast";
import { AddNoteApi, NotesListApi, UpdateNoteApi } from "../../services/notes/Notes";

// Notes List API
export const GetNotesList = createAsyncThunk(
  "notes/getNotesList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await NotesListApi(data);
      if (response?.status === 200) {
        return response?.data;
      } else {
       
        return rejectWithValue("Something went wrong");
      }
    } catch (error) {
      notify("error", "Failed to fetch notes list");
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);


//Add Notes API
export const GetAddNote = createAsyncThunk(
  "notes/getAddNote",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AddNoteApi(data);
      if (response?.status === 200) {
        return response?.data;
      } else {
       
        return rejectWithValue("Something went wrong");
      }
    } catch (error) {
      notify("error", "Failed to fetch notes list");
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);


//update Notes API
export const GetUpdateNote = createAsyncThunk(
  "notes/getUpdateNote",
  async (data, { rejectWithValue }) => {
    try {
      const response = await UpdateNoteApi(data);
      if (response?.status === 200) {
        return response?.data;
      } else {
       
        return rejectWithValue("Something went wrong");
      }
    } catch (error) {
      notify("error", "Failed to fetch notes list");
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);