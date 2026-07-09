import axios from 'axios';
import { supabase } from './supabase.js';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Express API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Supabase JWT token
api.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('[AUTH TRACE] Frontend - Session Token:', session?.access_token ? session.access_token.substring(0, 15) + '...' : 'NONE');
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
      console.log('[AUTH TRACE] Frontend - Sending Header:', config.headers.Authorization.substring(0, 25) + '...');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error format
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return Promise.reject(new Error(message));
  }
);

export default api;
