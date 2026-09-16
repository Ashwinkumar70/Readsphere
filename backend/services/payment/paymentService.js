import { StripeAdapter } from './stripeAdapter.js';

class PaymentService {
  constructor() {
    this.adapters = {
      stripe: new StripeAdapter(),
      // Future adapters like Razorpay, PayPal can be instantiated here
    };
    
    // Default provider could come from ENV
    this.defaultProvider = process.env.PAYMENT_PROVIDER || 'stripe';
  }

  getAdapter(providerName) {
    const adapter = this.adapters[providerName || this.defaultProvider];
    if (!adapter) {
      throw new Error(`Payment provider ${providerName} is not supported.`);
    }
    return adapter;
  }

  async processPayment(paymentDetails, providerName = null) {
    try {
      const adapter = this.getAdapter(providerName);
      const result = await adapter.processPayment(paymentDetails);
      return result;
    } catch (error) {
      console.error('[PaymentService] Error processing payment:', error);
      throw error;
    }
  }

  async refundPayment(transactionId, amount, providerName = null) {
    try {
      const adapter = this.getAdapter(providerName);
      const result = await adapter.refundPayment(transactionId, amount);
      return result;
    } catch (error) {
      console.error('[PaymentService] Error processing refund:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
