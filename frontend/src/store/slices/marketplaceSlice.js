import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/apiService.js';

export const fetchWishlist = createAsyncThunk(
  'marketplace/fetchWishlist',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/marketplace/wishlist');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'marketplace/addToWishlist',
  async (bookId, thunkAPI) => {
    try {
      const response = await api.post('/marketplace/wishlist', { bookId });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'marketplace/removeFromWishlist',
  async (id, thunkAPI) => {
    try {
      const response = await api.delete(`/marketplace/wishlist/${id}`);
      return { id, message: response.data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchOrderHistory = createAsyncThunk(
  'marketplace/fetchOrderHistory',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/marketplace/orders');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const purchaseBooks = createAsyncThunk(
  'marketplace/purchaseBooks',
  async (purchaseData, thunkAPI) => {
    // purchaseData: { bookIds: [...], amount: number, currency: 'USD' }
    try {
      const response = await api.post('/marketplace/purchase', purchaseData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  wishlist: [],
  orderHistory: [],
  loading: false,
  error: null,
};

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to Wishlist
      .addCase(addToWishlist.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.wishlist.push(action.payload.data);
        }
      })
      // Remove from Wishlist
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlist = state.wishlist.filter(item => item.id !== action.payload.id);
      })
      // Fetch Order History
      .addCase(fetchOrderHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.orderHistory = action.payload;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default marketplaceSlice.reducer;
