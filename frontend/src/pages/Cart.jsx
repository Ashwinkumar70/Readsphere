import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../store/slices/cartSlice.js';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button.jsx';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading, error } = useSelector(state => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error loading cart</h2>
        <p className="text-muted">{error}</p>
        <Button onClick={() => dispatch(fetchCart())} className="mt-6">Retry</Button>
      </div>
    );
  }

  const hasItems = cart?.order_items?.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 min-h-[80vh]">
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-8">
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-heading font-bold text-text flex items-center gap-3">
            <ShoppingCart size={32} className="text-primary" />
            Your Cart
          </h1>
        </div>

        {!hasItems ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-border shadow-sm">
            <ShoppingCart size={64} className="mx-auto text-gray-200 mb-6" />
            <h3 className="text-2xl font-bold text-text mb-2">Your cart is empty</h3>
            <p className="text-muted mb-8 max-w-md mx-auto">Looks like you haven't added any books yet. Discover your next great read in the Marketplace.</p>
            <Button size="lg" onClick={() => navigate('/marketplace')}>Browse Books</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cart.order_items.map((item) => (
                <div key={item.id} className="flex gap-6 p-6 bg-white border border-border rounded-2xl shadow-sm items-center">
                  <div className="w-24 h-36 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                     {item.books?.cover_url ? (
                       <img src={item.books.cover_url} alt={item.books.title} className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-gray-400">No Cover</div>
                     )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text">{item.books?.title}</h3>
                    <p className="text-sm text-muted mb-4">Qty: {item.quantity}</p>
                    <div className="text-lg font-bold text-primary">${Number(item.unit_price).toFixed(2)}</div>
                  </div>
                  <button className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white border border-border rounded-2xl p-8 shadow-sm h-fit sticky top-24">
              <h3 className="text-xl font-bold text-text mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted">
                  <span>Subtotal ({cart.order_items.length} items)</span>
                  <span>${Number(cart.total_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Estimated Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between font-bold text-lg text-text">
                  <span>Total</span>
                  <span>${Number(cart.total_amount).toFixed(2)}</span>
                </div>
              </div>

              <Button size="lg" className="w-full flex items-center justify-center gap-2" onClick={() => navigate('/checkout')}>
                Proceed to Checkout <ArrowRight size={18} />
              </Button>
            </div>
            
          </div>
        )}
      </motion.div>
    </div>
  );
}
