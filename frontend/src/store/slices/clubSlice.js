import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/apiService.js';

export const fetchClubs = createAsyncThunk(
  'clubs/fetchClubs',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/clubs');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const joinClub = createAsyncThunk(
  'clubs/joinClub',
  async (clubId, thunkAPI) => {
    try {
      const response = await api.post(`/clubs/${clubId}/join`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const fetchClubMessages = createAsyncThunk(
  'clubs/fetchClubMessages',
  async (clubId, thunkAPI) => {
    try {
      const response = await api.get(`/clubs/${clubId}/messages`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const postClubMessage = createAsyncThunk(
  'clubs/postClubMessage',
  async ({ clubId, content }, thunkAPI) => {
    try {
      const response = await api.post(`/clubs/${clubId}/messages`, { content });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  clubs: [],
  currentClubMessages: [],
  loading: false,
  error: null,
};

const clubSlice = createSlice({
  name: 'clubs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Clubs
      .addCase(fetchClubs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClubs.fulfilled, (state, action) => {
        state.loading = false;
        state.clubs = action.payload;
      })
      .addCase(fetchClubs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Join Club
      .addCase(joinClub.fulfilled, (state, action) => {
        // Optimistically update club members count if applicable
      })
      // Fetch Messages
      .addCase(fetchClubMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClubMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClubMessages = action.payload;
      })
      .addCase(fetchClubMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Post Message
      .addCase(postClubMessage.fulfilled, (state, action) => {
        state.currentClubMessages.push(action.payload);
      });
  },
});

export default clubSlice.reducer;
