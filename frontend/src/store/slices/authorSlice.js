import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/apiService.js';

export const fetchAuthorProfile = createAsyncThunk(
  'author/fetchAuthorProfile',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/authors/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchAuthorDashboard = createAsyncThunk(
  'author/fetchAuthorDashboard',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/authors/dashboard');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  currentProfile: null,
  dashboardData: null,
  loading: false,
  error: null,
};

const authorSlice = createSlice({
  name: 'author',
  initialState,
  reducers: {
    clearCurrentProfile: (state) => {
      state.currentProfile = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Author Profile
      .addCase(fetchAuthorProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAuthorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload;
      })
      .addCase(fetchAuthorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Author Dashboard
      .addCase(fetchAuthorDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAuthorDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchAuthorDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentProfile } = authorSlice.actions;
export default authorSlice.reducer;
