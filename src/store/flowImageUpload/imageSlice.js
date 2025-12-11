// store/slices/imageSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  imageUrl: null, // Store the uploaded image URL
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setImageUrl: (state, action) => {
      state.imageUrl = action.payload;
    },
    clearImageUrl: (state) => {
      state.imageUrl = null;
    },
  },
});

export const { setImageUrl, clearImageUrl } = imageSlice.actions;

export default imageSlice.reducer;
