import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/apiService.js';

export const fetchCollections = createAsyncThunk(
  'library/fetchCollections',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/library/collections');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createCollection = createAsyncThunk(
  'library/createCollection',
  async (collectionData, thunkAPI) => {
    try {
      const response = await api.post('/library/collections', collectionData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateReadProgress = createAsyncThunk(
  'library/updateReadProgress',
  async ({ bookId, progress }, thunkAPI) => {
    try {
      const response = await api.put(`/library/progress/${bookId}`, { progress });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  collections: [],
  likedBookIds: [],
  loading: false,
  error: null,
};

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    toggleLikeBook: (state, action) => {
      const bookId = action.payload;
      if (state.likedBookIds.includes(bookId)) {
        state.likedBookIds = state.likedBookIds.filter(id => id !== bookId);
      } else {
        state.likedBookIds.push(bookId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Collections
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.collections = action.payload;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Collection
      .addCase(createCollection.fulfilled, (state, action) => {
        state.collections.push(action.payload);
      });
  },
});

export const { toggleLikeBook } = librarySlice.actions;
export default librarySlice.reducer;
