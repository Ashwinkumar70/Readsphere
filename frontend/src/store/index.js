import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import libraryReducer from './slices/librarySlice';
import userReducer from './slices/userSlice';
import bookReducer from './slices/bookSlice.js';
import authorReducer from './slices/authorSlice.js';
import clubReducer from './slices/clubSlice.js';
import aiReducer from './slices/aiSlice.js';
import dashboardReducer from './slices/dashboardSlice.js';
import readerReducer from './slices/readerSlice.js';

// Phase 4 Commerce Slices
import cartReducer from './slices/cartSlice.js';
import orderReducer from './slices/orderSlice.js';
import paymentReducer from './slices/paymentSlice.js';
import wishlistReducer from './slices/wishlistSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    library: libraryReducer,
    userData: userReducer,
    books: bookReducer,
    author: authorReducer,
    clubs: clubReducer,
    ai: aiReducer,
    dashboard: dashboardReducer,
    reader: readerReducer,
    
    // Commerce
    cart: cartReducer,
    order: orderReducer,
    payment: paymentReducer,
    wishlist: wishlistReducer,
  },
});
