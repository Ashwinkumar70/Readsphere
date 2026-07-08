import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/apiService.js';

export const sendChatMessage = createAsyncThunk(
  'ai/sendChatMessage',
  async ({ message, bookId }, thunkAPI) => {
    try {
      const response = await api.post('/ai/chat', { message, bookId });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const sendQuickAction = createAsyncThunk(
  'ai/sendQuickAction',
  async ({ actionId, bookId }, thunkAPI) => {
    try {
      const response = await api.post('/ai/action', { actionId, bookId });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  messages: [
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm your AI reading companion. Ask me anything about this book, or use the quick actions below!",
    }
  ],
  loading: false,
  error: null,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({
        id: crypto.randomUUID(),
        role: 'user',
        content: action.payload.message
      });
    },
    clearMessages: (state) => {
      state.messages = initialState.messages;
    }
  },
  extraReducers: (builder) => {
    builder
      // Chat Message
      .addCase(sendChatMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          id: crypto.randomUUID(),
          ...action.payload
        });
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Quick Action
      .addCase(sendQuickAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendQuickAction.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          id: crypto.randomUUID(),
          ...action.payload
        });
      })
      .addCase(sendQuickAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addUserMessage, clearMessages } = aiSlice.actions;
export default aiSlice.reducer;
