import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSopsCategory } from '../../services/sops/Sopscategory';

export const getSopsCategory = createAsyncThunk(
  'sops/fetchCategory',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchSopsCategory();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const sopsSlice = createSlice({
  name: 'sops',
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSopsCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSopsCategory.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(getSopsCategory.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default sopsSlice.reducer;
