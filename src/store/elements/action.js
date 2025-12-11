// ElementsFolderFileApi
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  ElementsCategoryApi,
  ElementsFolderFileApi,
  ElementsFolderDocumentApi,
  ElementsSidebarApi,
  CategoryApi,
  GetChatsListApi,
  SendMessageApi,
  GetContactListApi,
} from "../../services/elements/Elements";
import notify from "../../assets/svg/utils/toast/Toast";
import i18next from "i18next";

// subside name
export const GetElementsCategory = createAsyncThunk(
  "GetElementsCategory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ElementsCategoryApi(data);
      if (response?.status === 200) {
        return response?.data;
      } else {
        // notify('error', 'Something went wrong')
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//folders API
export const GetElementsFolderFile = createAsyncThunk(
  "GetElementsFolderFile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ElementsFolderFileApi(data);
      if (response?.status === 200) {
        return response?.data;
      } else {
        notify("error", "Something went wrong");
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const GetElementsFolderDocument = createAsyncThunk(
  "elements/GetElementsFolderDocument",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ElementsFolderDocumentApi(data);
      if (response?.status === 200) {
        return response?.data;
      } else {
        if (response?.data?.error) {
          notify("error", response.data.error);
        } else {
          notify("error", "Something went wrong");
        }
      }
    } catch (error) {
      if (error?.response?.data?.error) {
        notify("error", error.response.data.error);
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const GetElementsSidebar = createAsyncThunk(
  "elements/GetElementsSidebar",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ElementsSidebarApi();
      if (response?.status === 200) {
        return response?.data;
      } else {
        // notify('error', 'Something went wrong');
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const AddCategory = createAsyncThunk(
  "elements/AddCategory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await CategoryApi(data);
      if (response?.status === 201) {
        notify(
          "success",
          i18next.t("Category created successfully") ||
            response.data.message.replace(/[^\w\s]/gi, " ")
        );
        return true;
      } else {
        const errorMsg =
          response?.data?.error ||
          Object.values(response?.data?.errors || {})[0] ||
          "An unexpected error occurred";

        notify("error", errorMsg.replace(/[^\w\s]/gi, " "));
        return false;
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.error ||
        Object.values(error?.response?.data?.errors || {})[0] ||
        "An unexpected error occurred";

      notify("error", errorMsg.replace(/[^\w\s]/gi, " "));
      return rejectWithValue(errorMsg.replace(/[^\w\s]/gi, " "));
    }
  }
);

export const GetChatsList = createAsyncThunk(
  "elements/GetChatsList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await GetChatsListApi(data);
      if (response?.status === 200) {
        return response?.data?.data;
      } else {
        // notify('error', 'Something went wrong');
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const GetContactList = createAsyncThunk(
  "elements/GetContactList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await GetContactListApi(data);
      if (response?.status === 200) {
        return response?.data?.data;
      } else {
        // notify('error', 'Something went wrong');
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const SendMessage = createAsyncThunk(
  "elements/SendMessage",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await SendMessageApi(data);
      if (response?.status === 201) {
        return response?.data;
      } else {
        // notify('error', 'Something went wrong');
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
