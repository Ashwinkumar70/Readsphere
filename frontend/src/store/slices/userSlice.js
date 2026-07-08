import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/apiService.js';

// Fetch Notifications
export const fetchNotifications = createAsyncThunk(
  'user/fetchNotifications',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'user/markNotificationRead',
  async (id, thunkAPI) => {
    try {
      const response = await api.put(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Fetch Dashboard Stats
export const fetchDashboardStats = createAsyncThunk(
  'user/fetchDashboardStats',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/auth/dashboard');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Fetch Wishlist
export const fetchWishlist = createAsyncThunk(
  'user/fetchWishlist',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/marketplace/wishlist');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  wishlist: [],
  dashboardStats: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark Read
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n.id === action.payload.id);
        if (index !== -1 && !state.notifications[index].is_read) {
          state.notifications[index].is_read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      // Wishlist
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
      // Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
