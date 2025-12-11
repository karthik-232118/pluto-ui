// ElementsFolderFileApi
import { createAsyncThunk } from "@reduxjs/toolkit";
import notify from "../../assets/svg/utils/toast/Toast";
import {
  getcampListApi,
  getforms,
  sendBulkemails,
  getbulkemailList
} from "../../services/eSign/ESignModule";

export const SendBulkemails = createAsyncThunk(
  "esign/SendBulkemails",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      // Making API call to send bulk emails
      const response = await sendBulkemails(data);

      // Check if the response status is true (success)
      if (response?.status === 200) {
        console.log(response);
        // Success response
        notify("success", response?.data?.message);
        return response?.data;
      } else {
        // Failure response with status false or an unexpected status
        // notify(
        //   "error",
        //   response?.data?.message ||
        //     "Something went wrong while sending emails."
        // );
        return rejectWithValue(
          response?.data?.message || "Failed to send emails"
        );
      }
    } catch (error) {
      // Catching any errors that occur during the API call
      console.error("Error sending bulk emails:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while sending emails.";
      // Notify the user about the error
      notify("error", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const GetFormsList = createAsyncThunk(
  "esign/GetFormsList",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      // Making API call to send bulk emails
      const response = await getforms(data);
      // Check if the response status is true (success)
      if (response?.status === 200) {
        // Success response
        return response?.data?.data;
      } else {
        // Failure response with status false or an unexpected status
        notify(
          "error",
          response?.data?.message ||
            "Something went wrong while sending emails."
        );
        return rejectWithValue(
          response?.data?.message || "Failed to send emails"
        );
      }
    } catch (error) {
      // Catching any errors that occur during the API call
      console.error("Error sending bulk emails:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while sending emails.";
      // Notify the user about the error
      notify("error", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const GetCampList = createAsyncThunk(
  "esign/GetCampList",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      // Making API call to send bulk emails
      const response = await getcampListApi(data);

      // Check if the response status is true (success)
      if (response?.status === 200) {
        // Success response
        return response?.data?.data;
      } else {
        // Failure response with status false or an unexpected status
        notify(
          "error",
          response?.data?.message ||
            "Something went wrong while sending emails."
        );
        return rejectWithValue(
          response?.data?.message || "Failed to send emails"
        );
      }
    } catch (error) {
      // Catching any errors that occur during the API call
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while sending emails.";
      // Notify the user about the error
      notify("error", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);


export const GetBulkEmailReports = createAsyncThunk(
  "esign/GetBulkEmailReports",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      // Making API call to send bulk emails
      const response = await getbulkemailList(data);

      // Check if the response status is true (success)
      if (response?.status === 200) {
        // Success response
        return response?.data?.data;
      } else {
        // Failure response with status false or an unexpected status
        notify(
          "error",
          response?.data?.message ||
            "Something went wrong while sending emails."
        );
        return rejectWithValue(
          response?.data?.message || "Failed to send emails"
        );
      }
    } catch (error) {
      // Catching any errors that occur during the API call
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while sending emails.";
      // Notify the user about the error
      notify("error", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);



