import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  MyRequestApi,
  AddNewReqApi,
  EditReqApi,
  DeleteReqApi,
} from "../../services/myreq/myreq";
import notify from "../../assets/svg/utils/toast/Toast";
import { Getentrprise } from "../enterprise/action";
import i18next from "i18next";

export const GetMyrequest = createAsyncThunk(
  "GetMyrequest",
  async (data, { rejectWithValue }) => {
    try {
      const response = await MyRequestApi();
      if (response?.status === 200) {
        return response?.data;
        // notify("error", "Something went wrong");
      } else {
        // notify("error", "Something went wrong");
        return rejectWithValue("Failed to fetch favourites");
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data || "An error occurred");
    }
  }
);

export const AddNewReq = createAsyncThunk(
  "GetMyrequest",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await AddNewReqApi(data);
      if (response?.status === 201) {
        notify("success", i18next.t("Request added successfully") ||response.data.message);
        dispatch(GetMyrequest());
        return true;
      } else {
        notify(
          "error",
          response.data.error.replace(/[^\w\s]/gi, " ") ||
          "An unexpected error occurred"
        );
        return false;
      }
    } catch (error) {
      console.error(error);
      notify(
        "error",
        error.response.data.error.replace(/[^\w\s]/gi, " ") ||
        "An unexpected error occurred"
      );
      return rejectWithValue(
        error.response.data.error.replace(/[^\w\s]/gi, " ") ||
        "An unexpected error occurred"
      );
    }
  }
);

export const EditReq = createAsyncThunk(
  "GetMyrequest",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await EditReqApi(data);
      if (response?.status === 200) {
        notify("success", response.data.message);
        dispatch(GetMyrequest());
        return true;
      } else {
        notify(
          "error",
          response.data.error.replace(/[^\w\s]/gi, " ") ||
          "An unexpected error occurred"
        );
        return false;
      }
    } catch (error) {
      notify(
        "error",
        error.response.data.error.replace(/[^\w\s]/gi, " ") ||
        "An unexpected error occurred"
      );
      return rejectWithValue(
        error.response.data.error.replace(/[^\w\s]/gi, " ") ||
        "An unexpected error occurred"
      );
    }
  }
);

export const DeleteReq = createAsyncThunk(
  "GetMyrequest",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await DeleteReqApi(data);
      if (response?.status === 200) {
        notify("success", response.data.message);
        dispatch(GetMyrequest());
        return true;
      } else {
        notify(
          "error",
          response.data.error.replace(/[^\w\s]/gi, " ") ||
          "An unexpected error occurred"
        );
        return false;
      }
    } catch (error) {
      notify(
        "error",
        error.response.data.error.replace(/[^\w\s]/gi, " ") ||
        "An unexpected error occurred"
      );
      return rejectWithValue(
        error.response.data.error.replace(/[^\w\s]/gi, " ") ||
        "An unexpected error occurred"
      );
    }
  }
);
