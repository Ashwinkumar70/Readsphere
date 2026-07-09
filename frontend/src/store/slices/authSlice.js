import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/apiService.js';
import { supabase } from '../../lib/supabase.js';

// --- Async Thunks ---

// Email/Password Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Manually set the session on the frontend Supabase client 
      // so that it gets saved to localStorage and persists across refreshes.
      if (response.data.token && response.data.refreshToken) {
        await supabase.auth.setSession({
          access_token: response.data.token,
          refresh_token: response.data.refreshToken,
        });
      }

      return response.data; // Expected: { id, name, email, avatar_url, role }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Register
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, username, email, password }, thunkAPI) => {
    try {
      const response = await api.post('/auth/register', { name, username, email, password });
      
      if (response.data.token && response.data.refreshToken) {
        await supabase.auth.setSession({
          access_token: response.data.token,
          refresh_token: response.data.refreshToken,
        });
      }

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, thunkAPI) => {
    try {
      await api.post('/auth/logout');
      await supabase.auth.signOut();
      return null;
    } catch (error) {
      // Even if API fails, sign out locally
      await supabase.auth.signOut();
      return null;
    }
  }
);

// Fetch Profile
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Update Profile
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (profileData, thunkAPI) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true, // Start as true to prevent premature redirects
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Used for quick local overrides or Google OAuth callback hydration
    setAuthSession: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
        // If profile fetch fails (e.g. 401 because user was deleted or no public.users row),
        // we must clear the local session to prevent infinite loops.
        supabase.auth.signOut().catch(console.error);
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAuthSession, clearAuthError, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
