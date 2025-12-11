import { createAsyncThunk } from "@reduxjs/toolkit";
import notify from "../../assets/svg/utils/toast/Toast";
import {
  GetAdvertisementApi,
  AddAdvertisementApi,
  deleteAdvertisementApi,
  EditAdvertisementApi,
} from "../../services/advertisement/Advertisement";
import i18next from "i18next";

// Helper function for notifying and returning error messages
const handleResponse = (response, successMessage, pagination, dispatch) => {
  if (response?.status >= 200 && response?.status < 300) {
    notify("success", i18next.t("success_generic") ||  successMessage);
    dispatch(GetAdvertisement(pagination));
    return true;
  } else {
    notify(
      "error",
      response?.data?.message.replace(/[^\w\s]/gi, " ") ||
        response.response?.data?.error.replace(/[^\w\s]/gi, " ")
    );
    return false;
  }
};

export const GetAdvertisement = createAsyncThunk(
  "advertisement/get",
  async (data, { rejectWithValue }) => {
    try {
      const response = await GetAdvertisementApi(data);
      // return handleResponse(response, "", null, null);
      return response.data.data;
    } catch (error) {
      notify(
        "error",
        error.response?.data?.message?.replace(/[^\w\s]/gi, " ") ||
          error.response?.data?.error.replace(/[^\w\s]/gi, " ")
      );
      return rejectWithValue(error);
    }
  }
);

export const AddAdvertisement = createAsyncThunk(
  "advertisement/add",
  async ({ formData, pagination }, { dispatch, rejectWithValue }) => {
    try {
      const response = await AddAdvertisementApi(formData);
      return handleResponse(
        response,
        response?.data?.message,
        pagination,
        dispatch
      );
    } catch (error) {
      notify(
        "error",
        error.response?.data?.message?.replace(/[^\w\s]/gi, " ") ||
          error.response?.data?.error.replace(/[^\w\s]/gi, " ")
      );
      return rejectWithValue(error);
    }
  }
);

export const EditAdvertisement = createAsyncThunk(
  "advertisement/edit",
  async ({ formData, pagination }, { dispatch, rejectWithValue }) => {
    try {
      const response = await EditAdvertisementApi(formData);
      return handleResponse(
        response,
        response?.data?.message,
        pagination,
        dispatch
      );
    } catch (error) {
      notify(
        "error",
        error.response?.data?.message?.replace(/[^\w\s]/gi, " ") ||
          error.response?.data?.error.replace(/[^\w\s]/gi, " ")
      );
      return rejectWithValue(error);
    }
  }
);

export const deleteAdvertisement = createAsyncThunk(
  "advertisement/delete",
  async ({ payload, pagination }, { dispatch, rejectWithValue }) => {
    try {
      const response = await deleteAdvertisementApi(payload);
      return handleResponse(
        response,
        response?.data?.message,
        pagination,
        dispatch
      );
    } catch (error) {
      notify(
        "error",
        error.response?.data?.message?.replace(/[^\w\s]/gi, " ") ||
          error.response?.data?.error.replace(/[^\w\s]/gi, " ")
      );
      return rejectWithValue(error);
    }
  }
);
