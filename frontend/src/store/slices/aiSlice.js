import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/apiService.js';

export const generateAIContent = createAsyncThunk(
  'ai/generate',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post(`/v1/ai/${payload.endpoint}`, {
        prompt: payload.prompt,
        model: payload.model,
        conversationId: payload.conversationId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'AI generation failed');
    }
  }
);

export const fetchAIHistory = createAsyncThunk(
  'ai/history',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/v1/ai/history');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch history');
    }
  }
);

const initialState = {
  activeResponse: null,
  activeConversationId: null,
  history: [],
  loading: false,
  error: null,
  usageCounter: 0
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearActiveResponse: (state) => {
      state.activeResponse = null;
      state.error = null;
    },
    addUserMessage: (state, action) => {
      state.messages = [...(state.messages || []), action.payload];
    },
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateAIContent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.activeResponse = null;
      })
      .addCase(generateAIContent.fulfilled, (state, action) => {
        state.loading = false;
        state.activeResponse = action.payload;
        state.activeConversationId = action.payload.conversationId || state.activeConversationId;
        state.usageCounter += action.payload.tokens;
      })
      .addCase(generateAIContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAIHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAIHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchAIHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Legacy adapters for AIWidget
export const sendChatMessage = createAsyncThunk('ai/chatMessage', async (payload, { dispatch }) => {
  return dispatch(generateAIContent({ endpoint: 'chat', prompt: payload, model: 'gemini-1.5-flash' }));
});

export const sendQuickAction = createAsyncThunk('ai/quickAction', async (payload, { dispatch }) => {
  return dispatch(generateAIContent({ endpoint: payload.action, prompt: payload.context, model: 'gemini-1.5-flash' }));
});

export const { clearActiveResponse, addUserMessage } = aiSlice.actions;
export default aiSlice.reducer;
