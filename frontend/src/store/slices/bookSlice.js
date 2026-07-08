import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/apiService.js';

export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (params, thunkAPI) => {
    try {
      const response = await api.get('/books', { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchBookById = createAsyncThunk(
  'books/fetchBookById',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  books: [],
  currentBook: null,
  loading: false,
  error: null,
};

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearCurrentBook: (state) => {
      state.currentBook = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentBook } = bookSlice.actions;
export default bookSlice.reducer;
