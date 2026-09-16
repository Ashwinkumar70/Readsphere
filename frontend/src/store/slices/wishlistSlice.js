import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// The bookmarks API is used as the wishlist backend (from the controller rewrite requirements)
export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, { rejectWithValue }) => {
  try {
    // Note: Depends on whether Phase 4 rewired /bookmarks or provided a new endpoint
    // Fallback to legacy bookmarks endpoint if marketplace/wishlist doesn't exist
    const { data } = await axios.get('/api/bookmarks');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default wishlistSlice.reducer;
