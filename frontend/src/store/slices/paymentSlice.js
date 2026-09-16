import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { clearCart } from './cartSlice.js';

export const processCheckout = createAsyncThunk('payment/processCheckout', async (checkoutData, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await axios.post('/api/v1/marketplace/checkout', checkoutData);
    // Upon success, we should clear the cart locally
    dispatch(clearCart());
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const initialState = {
  paymentResult: null,
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    resetPaymentStatus(state) {
      state.paymentResult = null;
      state.error = null;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(processCheckout.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(processCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentResult = action.payload;
      })
      .addCase(processCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetPaymentStatus } = paymentSlice.actions;
export default paymentSlice.reducer;
