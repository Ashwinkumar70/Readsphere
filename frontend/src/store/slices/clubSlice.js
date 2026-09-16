import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/apiService.js';

export const fetchClubs = createAsyncThunk('clubs/fetchClubs', async (_, thunkAPI) => {
  try {
    const response = await api.get('/clubs');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
  }
});

export const joinClub = createAsyncThunk('clubs/joinClub', async (clubId, thunkAPI) => {
  try {
    const response = await api.post(`/clubs/${clubId}/join`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
  }
});

export const leaveClub = createAsyncThunk('clubs/leaveClub', async (clubId, thunkAPI) => {
  try {
    const response = await api.post(`/clubs/${clubId}/leave`);
    return { clubId, ...response.data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
  }
});

export const fetchClubMessages = createAsyncThunk('clubs/fetchClubMessages', async ({ clubId, page = 1, limit = 50 }, thunkAPI) => {
  try {
    const response = await api.get(`/clubs/${clubId}/messages?page=${page}&limit=${limit}`);
    return { clubId, page, messages: response.data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
  }
});

export const postClubMessage = createAsyncThunk('clubs/postClubMessage', async ({ clubId, content }, thunkAPI) => {
  try {
    const response = await api.post(`/clubs/${clubId}/messages`, { content });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
  }
});

export const editClubMessage = createAsyncThunk('clubs/editClubMessage', async ({ msgId, content }, thunkAPI) => {
  try {
    const response = await api.put(`/clubs/messages/${msgId}`, { content });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
  }
});

export const deleteClubMessage = createAsyncThunk('clubs/deleteClubMessage', async (msgId, thunkAPI) => {
  try {
    await api.delete(`/clubs/messages/${msgId}`);
    return msgId;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
  }
});

const initialState = {
  clubs: [],
  currentClubMessages: [],
  loading: false,
  error: null,
};

const clubSlice = createSlice({
  name: 'clubs',
  initialState,
  reducers: {
    addRealtimeMessage: (state, action) => {
      // Avoid duplicates
      if (!state.currentClubMessages.find(m => m.id === action.payload.id)) {
        state.currentClubMessages.unshift(action.payload);
      }
    },
    updateRealtimeMessage: (state, action) => {
      const idx = state.currentClubMessages.findIndex(m => m.id === action.payload.id);
      if (idx !== -1) {
        state.currentClubMessages[idx] = action.payload;
      }
    },
    removeRealtimeMessage: (state, action) => {
      state.currentClubMessages = state.currentClubMessages.filter(m => m.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClubs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchClubs.fulfilled, (state, action) => { state.loading = false; state.clubs = action.payload; })
      .addCase(fetchClubs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      .addCase(fetchClubMessages.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchClubMessages.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.currentClubMessages = action.payload.messages;
        } else {
          state.currentClubMessages = [...state.currentClubMessages, ...action.payload.messages];
        }
      })
      .addCase(fetchClubMessages.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      .addCase(postClubMessage.fulfilled, (state, action) => {
        if (!state.currentClubMessages.find(m => m.id === action.payload.id)) {
          state.currentClubMessages.unshift(action.payload);
        }
      })
      
      .addCase(editClubMessage.fulfilled, (state, action) => {
        const idx = state.currentClubMessages.findIndex(m => m.id === action.payload.id);
        if (idx !== -1) {
          state.currentClubMessages[idx] = action.payload;
        }
      })
      
      .addCase(deleteClubMessage.fulfilled, (state, action) => {
        state.currentClubMessages = state.currentClubMessages.filter(m => m.id !== action.payload);
      });
  },
});

export const { addRealtimeMessage, updateRealtimeMessage, removeRealtimeMessage } = clubSlice.actions;
export default clubSlice.reducer;
