import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import libraryReducer from './slices/librarySlice';
import userReducer from './slices/userSlice';
import bookReducer from './slices/bookSlice.js';
import authorReducer from './slices/authorSlice.js';
import clubReducer from './slices/clubSlice.js';
import marketplaceReducer from './slices/marketplaceSlice.js';
import aiReducer from './slices/aiSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    library: libraryReducer,
    userData: userReducer,
    books: bookReducer,
    author: authorReducer,
    clubs: clubReducer,
    marketplace: marketplaceReducer,
    ai: aiReducer,
  },
});
