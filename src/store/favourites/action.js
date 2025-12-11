import { createAsyncThunk } from "@reduxjs/toolkit";
import notify from "../../assets/svg/utils/toast/Toast";
import {
  AddFavouritesApi,
  FavouritesApi,
} from "../../services/favourites/FavouritesList";

// Favourites API

export const GetFavourites = createAsyncThunk(
  "GetFavourites",
  async (data, { rejectWithValue }) => {
    try {
      const response = await FavouritesApi(data);
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

// AddFavouritesApi

export const GetAddFavourites = createAsyncThunk(
  "GetAddFavourites",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AddFavouritesApi(data);
      if (response?.status === 200) {
        return response?.data;
      } else {
        // notify('error', 'Something went wrong')
        return rejectWithValue("Failed to fetch favourites");
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data || "An error occurred");
    }
  }
);
