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
    const selectedRole = localStorage.getItem('selectedRole');
    if (selectedRole) {
      config.headers['x-selected-role'] = selectedRole;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError || !data.session) {
          throw new Error('Session refresh failed');
        }

        const newToken = data.session.access_token;
        processQueue(null, newToken);
        originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await supabase.auth.signOut();
        window.dispatchEvent(new Event('session-expired'));
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Standardize error format
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return Promise.reject(new Error(message));
  }
);

export default api;
