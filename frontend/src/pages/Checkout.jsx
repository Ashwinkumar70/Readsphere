import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../store/slices/cartSlice.js';
import { processCheckout, resetPaymentStatus } from '../store/slices/paymentSlice.js';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import { CreditCard, CheckCircle, AlertCircle, ArrowRight, Lock } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading: cartLoading } = useSelector(state => state.cart);
  const { paymentResult, loading: paymentLoading, error: paymentError } = useSelector(state => state.payment);

  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Success

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(resetPaymentStatus());
  }, [dispatch]);

  // If payment succeeds, move to success step
  useEffect(() => {
    if (paymentResult?.success) {
      setStep(3);
    }
  }, [paymentResult]);

  const handleCheckout = () => {
    // In MVP, we just pass the mock payment payload
    dispatch(processCheckout({
      paymentDetails: {
        method: 'card',
        mockSuccess: true // Tells Stripe adapter to succeed
      }
    }));
  };

  if (cartLoading) {
    return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mt-20"></div>;
  }

  if (cart?.order_items?.length === 0 && step !== 3) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-24 min-h-[80vh]">
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-8">
        
        {step !== 3 && (
          <h1 className="text-3xl font-heading font-bold text-text mb-8 text-center flex justify-center items-center gap-3">
            <Lock size={28} className="text-primary" /> Secure Checkout
          </h1>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: Details / Address (Mocked for digital MVP) */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-white rounded-3xl border border-border p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Billing Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Input label="Full Name" placeholder="Jane Doe" required />
                <Input label="Email Address" type="email" placeholder="jane@example.com" required />
              </div>
              <Button size="lg" className="w-full flex justify-center items-center gap-2" onClick={() => setStep(2)}>
                Continue to Payment <ArrowRight size={18} />
              </Button>
            </motion.div>
          )}

          {/* STEP 2: Payment */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-white rounded-3xl border border-border p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Payment Details</h2>
                <span className="font-bold text-xl text-primary">${Number(cart.total_amount).toFixed(2)}</span>
              </div>
              
              {paymentError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 mb-6">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{paymentError}</p>
                </div>
              )}

              <div className="bg-gray-50 border border-border rounded-xl p-6 mb-8 flex flex-col items-center justify-center text-center">
                <CreditCard size={48} className="text-gray-300 mb-4" />
                <p className="text-muted text-sm max-w-sm mb-4">
                  For this MVP, payments are processed via the Stripe Sandbox integration. No real card is required.
                </p>
              </div>

              <div className="flex gap-4">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button size="lg" className="flex-1" loading={paymentLoading} onClick={handleCheckout}>
                  Pay ${Number(cart.total_amount).toFixed(2)}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Success */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 bg-white rounded-3xl border border-border shadow-sm">
              <CheckCircle size={80} className="mx-auto text-green-500 mb-6" />
              <h1 className="text-4xl font-heading font-bold text-text mb-4">Payment Successful!</h1>
              <p className="text-muted text-lg mb-2">Thank you for your purchase.</p>
              <p className="text-sm text-gray-400 mb-8">Order ID: {paymentResult?.orderId}</p>
              
              <div className="flex justify-center gap-4">
                <Button onClick={() => navigate('/orders')}>View Order History</Button>
                <Button variant="ghost" onClick={() => navigate('/library')}>Go to Library</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
