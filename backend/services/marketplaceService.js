import { supabase } from '../config/supabase.js';
import { eventBus, EVENTS } from './eventBus.js';
import { paymentService } from './payment/paymentService.js';
import crypto from 'crypto';

export class MarketplaceService {
  /**
   * Retrieves the current cart for a user.
   * We store the cart in the `orders` table with status = 'Cart'.
   */
  async getCart(userId) {
    const { data: cart, error } = await supabase
      .from('orders')
      .select(`
        id, total_amount, currency, status,
        order_items ( id, book_id, quantity, unit_price, subtotal, books(title, cover_url, author_id) )
      `)
      .eq('user_id', userId)
      .eq('status', 'Cart')
      .maybeSingle();

    if (error) throw new Error(error.message);
    return cart || { status: 'Cart', order_items: [], total_amount: 0, currency: 'USD' };
  }

  /**
   * Adds an item to the cart. Creates the cart if it doesn't exist.
   */
  async addToCart(userId, bookId, quantity = 1) {
    // 1. Get book price
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('price')
      .eq('id', bookId)
      .single();

    if (bookError || !book) throw new Error('Book not found');
    const unitPrice = book.price || 0;

    // 2. Find or create cart
    let { data: cart } = await supabase
      .from('orders')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'Cart')
      .maybeSingle();

    if (!cart) {
      const { data: newCart, error: cartError } = await supabase
        .from('orders')
        .insert([{ user_id: userId, status: 'Cart', total_amount: 0 }])
        .select('id')
        .single();
      if (cartError) throw new Error(cartError.message);
      cart = newCart;
    }

    // 3. Add to order_items (or update quantity if exists)
    const { data: existingItem } = await supabase
      .from('order_items')
      .select('id, quantity')
      .eq('order_id', cart.id)
      .eq('book_id', bookId)
      .maybeSingle();

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      await supabase
        .from('order_items')
        .update({ quantity: newQty, subtotal: newQty * unitPrice })
        .eq('id', existingItem.id);
    } else {
      await supabase
        .from('order_items')
        .insert([{
          order_id: cart.id,
          book_id: bookId,
          quantity,
          unit_price: unitPrice,
          subtotal: quantity * unitPrice
        }]);
    }

    await this._recalculateCartTotal(cart.id);
    return this.getCart(userId);
  }

  async _recalculateCartTotal(cartId) {
    const { data: items } = await supabase
      .from('order_items')
      .select('subtotal')
      .eq('order_id', cartId);
    
    const total = items ? items.reduce((acc, item) => acc + Number(item.subtotal), 0) : 0;
    await supabase.from('orders').update({ total_amount: total }).eq('id', cartId);
  }

  /**
   * Processes the checkout. Implement transaction-like rollback on failure.
   */
  async checkout(userId, paymentDetails, shippingAddressId = null) {
    const cart = await this.getCart(userId);
    if (!cart.id || cart.order_items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Idempotency: Prevent processing if cart is no longer 'Cart'
    const { data: currentCart } = await supabase
      .from('orders')
      .select('status')
      .eq('id', cart.id)
      .single();

    if (currentCart.status !== 'Cart') {
      throw new Error('Order is already processed or processing');
    }

    // Mark as pending temporarily (Reservation Phase)
    await supabase.from('orders').update({ status: 'Pending' }).eq('id', cart.id);

    try {
      // 1. Process Payment via Abstraction Layer
      const paymentResult = await paymentService.processPayment({
        amount: cart.total_amount,
        currency: cart.currency,
        ...paymentDetails
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment failed');
      }

      // 2. Record Payment
      const { data: paymentRecord } = await supabase
        .from('payments')
        .insert([{
          order_id: cart.id,
          user_id: userId,
          amount: cart.total_amount,
          provider: 'Stripe',
          status: 'Completed',
          transaction_id: paymentResult.transactionId
        }])
        .select('id')
        .single();

      await supabase
        .from('payment_transactions')
        .insert([{
          payment_id: paymentRecord.id,
          gateway_response: paymentResult.rawResponse
        }]);

      // 3. Handle Physical Orders
      if (shippingAddressId) {
        await supabase
          .from('physical_orders')
          .insert([{
            order_id: cart.id,
            shipping_address_id: shippingAddressId,
            shipping_status: 'Processing'
          }]);
      }

      // 4. Mark Order as Completed
      await supabase.from('orders').update({ status: 'Completed' }).eq('id', cart.id);

      // 5. Emit Events (Decoupled orchestration)
      eventBus.emit(EVENTS.PAYMENT_SUCCESS, { userId, orderId: cart.id, items: cart.order_items });
      eventBus.emit(EVENTS.ORDER_CREATED, { userId, orderId: cart.id });

      return { success: true, orderId: cart.id, transactionId: paymentResult.transactionId };

    } catch (error) {
      // Rollback: Revert to 'Cart' if payment fails
      await supabase.from('orders').update({ status: 'Cart' }).eq('id', cart.id);
      eventBus.emit(EVENTS.PAYMENT_FAILED, { userId, orderId: cart.id, error: error.message });
      throw error;
    }
  }

  /**
   * Generates a temporary signed URL for digital downloads.
   */
  async getSecureDownloadUrl(userId, bookId) {
    // 1. Verify ownership (Must have a completed order containing this book)
    const { data: hasAccess } = await supabase
      .from('order_items')
      .select('id, orders!inner(user_id, status)')
      .eq('book_id', bookId)
      .eq('orders.user_id', userId)
      .eq('orders.status', 'Completed')
      .limit(1);

    if (!hasAccess || hasAccess.length === 0) {
      throw new Error('Unauthorized: You have not purchased this book.');
    }

    // 2. Get file path
    const { data: book } = await supabase.from('books').select('file_url').eq('id', bookId).single();
    if (!book || !book.file_url) throw new Error('Book file not found');

    // Extract path from public URL if necessary, or store path explicitly.
    // Assuming file_url is the full path or relative path inside book-files bucket.
    const filePath = book.file_url.split('/book-files/').pop();

    // 3. Generate signed URL (expires in 3600 seconds)
    const { data, error } = await supabase
      .storage
      .from('book-files')
      .createSignedUrl(filePath, 3600);

    if (error) throw new Error(error.message);

    // Audit Log
    eventBus.emit(EVENTS.DIGITAL_DOWNLOAD_REQUESTED, { userId, bookId });

    return { signedUrl: data.signedUrl };
  }

  /**
   * Retrieves order history for a user.
   */
  async getOrders(userId) {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id, status, total_amount, currency, created_at,
        order_items ( id, book_id, quantity, unit_price, subtotal, books(title, cover_url, author_id) ),
        payments ( id, provider, status, transaction_id ),
        physical_orders ( id, shipping_status, tracking_number )
      `)
      .eq('user_id', userId)
      .neq('status', 'Cart') // Do not include active carts
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return orders;
  }
}

export const marketplaceService = new MarketplaceService();
