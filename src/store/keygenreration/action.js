import { createAsyncThunk } from "@reduxjs/toolkit";
import notify from "../../assets/svg/utils/toast/Toast";
import { keygenrerationApi } from "../../services/keygenration/keygenration";

// Favourites API

export const Keygenreation = createAsyncThunk(
  "Keygenreation",
  async (data, { rejectWithValue }) => {
    try {
      const response = await keygenrerationApi(data);
      if (response?.status === 201) {
        notify("success",response?.data.message)
        return response?.data
      } else {
        return rejectWithValue("Failed to fetch favourites");
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data || "An error occurred");
    }
  }
);
