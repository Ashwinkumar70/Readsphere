import { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase.js';
import api from '../../lib/apiService.js';
import { logoutUser } from '../../store/slices/authSlice.js';
import { motion, AnimatePresence } from 'framer-motion';

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const WARNING_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes warning
const ACTIVITY_UPDATE_INTERVAL_MS = 5 * 60 * 1000; // Update activity every 5 mins

export default function SessionManager() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [showWarning, setShowWarning] = useState(false);
  const idleTimerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const lastActivityUpdateRef = useRef(0);

  const handleLogout = useCallback(async (isExpired = false) => {
    if (isExpired) {
      toast.error('Your session has expired. Please sign in again.', { duration: 5000 });
    } else {
      toast.success('You have been logged out successfully.', { duration: 4000 });
    }
    
    // Clear state & redirect
    await dispatch(logoutUser());
    setShowWarning(false);
    navigate('/');
  }, [dispatch, navigate]);

  const resetTimers = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);

    if (isAuthenticated) {
      idleTimerRef.current = setTimeout(() => {
        setShowWarning(true);
        // Set timer for when warning expires
        warningTimerRef.current = setTimeout(() => {
          handleLogout(true);
        }, WARNING_TIMEOUT_MS);
      }, IDLE_TIMEOUT_MS);
    }
  }, [isAuthenticated, handleLogout]);

  const handleUserActivity = useCallback(() => {
    if (!isAuthenticated || showWarning) return;
    
    resetTimers();

    const now = Date.now();
    if (now - lastActivityUpdateRef.current > ACTIVITY_UPDATE_INTERVAL_MS) {
      lastActivityUpdateRef.current = now;
      api.post('/auth/active').catch(err => console.error('Failed to update activity:', err));
    }
  }, [isAuthenticated, showWarning, resetTimers]);

  useEffect(() => {
    // 1. Setup Activity Listeners
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, handleUserActivity, { passive: true }));
    
    // Initial setup
    resetTimers();

    // 2. Setup Global 401 Interceptor Listener
    const onSessionExpired = () => {
      handleLogout(true);
    };
    window.addEventListener('session-expired', onSessionExpired);

    // 3. Setup cross-tab logout detection
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' && isAuthenticated) {
        // If we are still authenticated in Redux but Supabase says SIGNED_OUT,
        // it means another tab logged out. (Or local logout is in progress).
        // Since local logout calls navigate('/'), we just make sure we go to '/'
        toast.success('You have been logged out.', { id: 'logout-toast' });
        navigate('/');
      }
    });

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleUserActivity));
      window.removeEventListener('session-expired', onSessionExpired);
      subscription.unsubscribe();
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    };
  }, [handleUserActivity, handleLogout, resetTimers, isAuthenticated, navigate]);

  // Modal for Warning
  return (
    <AnimatePresence>
      {showWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card border border-border p-6 rounded-2xl shadow-xl max-w-sm w-full"
          >
            <h3 className="text-xl font-bold text-foreground mb-2">Session Inactive</h3>
            <p className="text-muted mb-6">
              Your session will expire in 5 minutes due to inactivity. Do you want to stay signed in?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => handleLogout(false)}
                className="px-4 py-2 text-sm font-medium text-muted hover:text-text transition-colors"
              >
                Log Out
              </button>
              <button 
                onClick={() => {
                  setShowWarning(false);
                  handleUserActivity();
                }}
                className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-full hover:bg-primary-600 transition-colors"
              >
                Stay Signed In
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
