// Stripe Adapter (Mock/Sandbox for MVP)
// Simulates a payment processing interaction with Stripe

export class StripeAdapter {
  constructor() {
    this.name = 'stripe';
  }

  async processPayment(paymentDetails) {
    console.log(`[StripeAdapter] Processing payment for amount: ${paymentDetails.amount} ${paymentDetails.currency}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simulate validation
    if (!paymentDetails.amount || paymentDetails.amount <= 0) {
      throw new Error('Invalid payment amount');
    }

    if (paymentDetails.currency !== 'USD') {
      throw new Error('Stripe sandbox currently only supports USD');
    }

    // Generate simulated response
    const isSuccess = paymentDetails.mockSuccess !== false; // Default true unless explicitly failed

    if (!isSuccess) {
      return {
        success: false,
        transactionId: null,
        error: 'Card declined by issuing bank (Simulated)',
        rawResponse: { status: 'declined', code: 'card_declined' }
      };
    }

    // Success response
    const transactionId = `pi_${Math.random().toString(36).substr(2, 14)}`; // Keep random for mock transaction ID, acceptable since it's just a mock adapter
    
    return {
      success: true,
      transactionId,
      error: null,
      rawResponse: { 
        id: transactionId, 
        object: 'payment_intent', 
        status: 'succeeded',
        amount: paymentDetails.amount,
        currency: paymentDetails.currency
      }
    };
  }

  async refundPayment(transactionId, amount) {
    console.log(`[StripeAdapter] Refunding payment ${transactionId} for amount: ${amount}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      refundId: `re_${Math.random().toString(36).substr(2, 14)}`,
      status: 'succeeded'
    };
  }
}
