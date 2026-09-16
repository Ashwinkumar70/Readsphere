import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../lib/apiService.js';

// --- Async Thunks ---

export const fetchReaderDashboard = createAsyncThunk(
  'reader/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/reader/dashboard');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reader dashboard');
    }
  }
);

export const fetchLibrary = createAsyncThunk(
  'reader/fetchLibrary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/reader/library');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch library');
    }
  }
);

export const fetchContinueReading = createAsyncThunk(
  'reader/fetchContinueReading',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/reader/continue-reading');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch continue reading list');
    }
  }
);

export const fetchReadingProgress = createAsyncThunk(
  'reader/fetchProgress',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/reader/progress/${bookId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reading progress');
    }
  }
);

export const updateReadingProgress = createAsyncThunk(
  'reader/updateProgress',
  async (progressData, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/reader/progress', progressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update reading progress');
    }
  }
);

export const fetchBookmarks = createAsyncThunk(
  'reader/fetchBookmarks',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/reader/bookmarks?bookId=${bookId || ''}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookmarks');
    }
  }
);

export const addBookmark = createAsyncThunk(
  'reader/addBookmark',
  async (bookmarkData, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/reader/bookmarks', bookmarkData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add bookmark');
    }
  }
);

export const removeBookmark = createAsyncThunk(
  'reader/removeBookmark',
  async (id, { rejectWithValue }) => {
    try {
      await apiService.delete(`/reader/bookmarks/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove bookmark');
    }
  }
);

// Preferences
export const fetchPreferences = createAsyncThunk(
  'reader/fetchPreferences',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/reader/preferences');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch preferences');
    }
  }
);

export const updatePreferences = createAsyncThunk(
  'reader/updatePreferences',
  async (preferences, { rejectWithValue }) => {
    try {
      const response = await apiService.put('/reader/preferences', preferences);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update preferences');
    }
  }
);

// File Fetching
export const fetchBookFileUrl = createAsyncThunk(
  'reader/fetchBookFileUrl',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/reader/file/${bookId}`);
      return response.data.url;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch book file url');
    }
  }
);

const initialState = {
  dashboard: null,
  library: [],
  continueReading: [],
  currentProgress: null,
  bookmarks: [],
  preferences: null,
  fileUrl: null,
  loading: false,
  error: null,
  lastFetched: null,
};

const readerSlice = createSlice({
  name: 'reader',
  initialState,
  reducers: {
    clearReader: (state) => {
      state.dashboard = null;
      state.library = [];
      state.continueReading = [];
      state.currentProgress = null;
      state.bookmarks = [];
      state.preferences = null;
      state.fileUrl = null;
      state.loading = false;
      state.error = null;
      state.lastFetched = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchReaderDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReaderDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchReaderDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Library
      .addCase(fetchLibrary.fulfilled, (state, action) => {
        state.library = action.payload;
      })
      // Continue Reading
      .addCase(fetchContinueReading.fulfilled, (state, action) => {
        state.continueReading = action.payload;
      })
      // Progress
      .addCase(fetchReadingProgress.fulfilled, (state, action) => {
        state.currentProgress = action.payload;
      })
      .addCase(updateReadingProgress.fulfilled, (state, action) => {
        state.currentProgress = action.payload;
      })
      // Bookmarks
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.bookmarks = action.payload;
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.bookmarks.push(action.payload);
      })
      .addCase(removeBookmark.fulfilled, (state, action) => {
        state.bookmarks = state.bookmarks.filter(b => b.id !== action.payload);
      })
      // Preferences
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.preferences = action.payload;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.preferences = action.payload;
      })
      // File Url
      .addCase(fetchBookFileUrl.fulfilled, (state, action) => {
        state.fileUrl = action.payload;
      });
  },
});

export const { clearReader } = readerSlice.actions;
export default readerSlice.reducer;
