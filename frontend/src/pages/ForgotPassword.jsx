import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

/* ─── Brand tokens ───────────────────────────────────────────────── */
const SAND    = 'rgb(240, 237, 228)';
const PRIMARY = '#004741';
const HOVER   = '#006A63';
const GOLD    = '#C89B3C';
const BORDER  = 'rgba(0,71,65,0.15)';
const CARD_BG = 'rgba(255,255,255,0.72)';

/* ─── Ambient orbs ───────────────────────────────────────────────── */
const ORBS = [
  { w: 380, h: 380, top: '-12%', left: '-6%',  color: 'rgba(0,71,65,0.10)'   },
  { w: 300, h: 300, top: '58%',  right: '-8%', color: 'rgba(200,155,60,0.12)' },
  { w: 220, h: 220, top: '28%',  left: '3%',   color: 'rgba(0,106,99,0.08)'  },
  { w: 260, h: 260, top: '-4%',  right: '8%',  color: 'rgba(0,71,65,0.08)'   },
];

function AmbientOrb({ w, h, top, left, right, color }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: w, height: h, top, left, right, background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, filter: 'blur(50px)' }}
      animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ─── Input field ────────────────────────────────────────────────── */
function Field({ icon: Icon, label, type = 'text', value, onChange, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          boxShadow: focused
            ? `0 0 0 2px ${PRIMARY}, 0 0 16px rgba(0,71,65,0.12)`
            : `0 0 0 1px ${BORDER}`,
        }}
        transition={{ duration: 0.2 }}
      />
      <div
        className="flex items-center gap-3 px-4 h-12 rounded-xl"
        style={{ background: focused ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)', transition: 'background 0.2s' }}
      >
        <Icon size={16} style={{ color: focused ? PRIMARY : 'rgba(0,71,65,0.45)', flexShrink: 0, transition: 'color 0.2s' }} />
        <input
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={label}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent outline-none text-[14px] min-w-0"
          style={{ color: PRIMARY, caretColor: PRIMARY }}
        />
      </div>
    </div>
  );
}

/* ─── Forgot Password Page ─────────────────────────────────────── */
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + import.meta.env.BASE_URL + 'reset-password',
      });
      if (error) throw error;
      setSuccess(true);
      toast.success('Password reset link sent!');
    } catch (error) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center overflow-hidden relative" style={{ background: SAND }}>
      {/* ── Ambient orbs ─────────────────────────────── */}
      {ORBS.map((o, i) => <AmbientOrb key={i} {...o} />)}

      {/* ── Dot grid ─────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,71,65,0.12) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.6,
        }}
      />

      {/* ── Logo ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="absolute top-6 left-8 z-20"
      >
        <Link to="/" className="flex items-center gap-2.5">
          <motion.div
            className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden"
            whileHover={{ scale: 1.08, rotate: -5 }}
          >
            <img src="/logo.png" alt="ReadSphere Logo" className="w-full h-full object-cover" />
          </motion.div>
          <div>
            <p className="text-[16px] font-black leading-none" style={{ fontFamily: 'Outfit, sans-serif', color: PRIMARY }}>ReadSphere</p>
          </div>
        </Link>
      </motion.div>

      {/* ── Main Layout ──────────────────────────────── */}
      <div className="flex items-center justify-center px-4 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="w-full max-w-[420px]"
        >
          {/* Icon badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 18, delay: 0.3 }}
            className="flex justify-center mb-5"
          >
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${PRIMARY} 0%, ${HOVER} 100%)`,
                border: `3px solid rgba(255,255,255,0.6)`,
                boxShadow: `0 8px 32px rgba(0,71,65,0.3), 0 0 0 8px rgba(0,71,65,0.08)`,
              }}
              animate={{ boxShadow: [`0 8px 24px rgba(0,71,65,0.25)`, `0 8px 40px rgba(200,155,60,0.3)`, `0 8px 24px rgba(0,71,65,0.25)`] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <KeyRound size={26} className="text-white" />
            </motion.div>
          </motion.div>

          {/* Card */}
          <div
            className="rounded-2xl px-8 py-8"
            style={{
              background: CARD_BG,
              border: `1px solid rgba(255,255,255,0.8)`,
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: `0 24px 64px rgba(0,71,65,0.1), 0 4px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)`,
            }}
          >
            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-[28px] font-black mb-1.5" style={{ fontFamily: 'Outfit, sans-serif', color: PRIMARY }}>
                Forgot <span style={{ color: GOLD }}>Password?</span>
              </h1>
              <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(0,71,65,0.55)' }}>
                {success 
                  ? "We've sent a password reset link to your email. Please check your inbox." 
                  : "Enter your email address and we'll send you a link to reset your password."}
              </p>
            </div>

            {/* Form */}
            {!success && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Field icon={Mail} label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.01, y: -1 } : {}}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full h-12 rounded-xl font-bold text-[15px] text-white overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${PRIMARY} 0%, ${HOVER} 60%, ${PRIMARY} 100%)`,
                    boxShadow: loading ? 'none' : `0 4px 20px rgba(0,71,65,0.4)`,
                  }}
                >
                  {!loading && (
                    <motion.div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)' }}
                      initial={{ x: '-120%' }}
                      animate={{ x: '220%' }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 0.6 }}
                    />
                  )}
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        <span>Sending…</span>
                      </motion.div>
                    ) : (
                      <motion.span key="lbl" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>Send Reset Link</motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
            )}

            <div className="mt-6 flex justify-center">
              <Link to="/login" className="flex items-center gap-1.5 text-[13px] font-semibold hover:opacity-75 transition-opacity" style={{ color: PRIMARY }}>
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
