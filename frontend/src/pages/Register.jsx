import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen, Eye, EyeOff, Mail, Lock, User, UserPlus,
  BookMarked, Users, Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/slices/authSlice';
import { supabase } from '../lib/supabase';
import { getDashboardRoute } from '../utils/roleRouter';

/* ─── Brand tokens ───────────────────────────────────────────────── */
const SAND    = 'rgb(240, 237, 228)';
const PRIMARY = '#004741';
const HOVER   = '#006A63';
const GOLD    = '#C89B3C';
const BORDER  = 'rgba(0,71,65,0.15)';
const CARD_BG = 'rgba(255,255,255,0.72)';

/* ─── Feature bar data ───────────────────────────────────────────── */
const FEATURES = [
  { icon: BookMarked, title: 'Read Anywhere',        desc: 'Access your books anytime, anywhere'  },
  { icon: Users,      title: 'Join Communities',     desc: 'Connect with readers and book lovers' },
  { icon: Sparkles,   title: 'AI Reading Assistant', desc: 'Smart summaries, insights & more'     },
];

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
function Field({ icon: Icon, label, type = 'text', value, onChange, right, id, required }) {
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
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={label}
          className="flex-1 bg-transparent outline-none text-[14px] min-w-0"
          style={{ color: PRIMARY, caretColor: PRIMARY }}
        />
        {right && (
          <motion.div
            className="cursor-pointer transition-colors"
            style={{ color: 'rgba(0,71,65,0.45)' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {right}
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ─── Register Page ─────────────────────────────────────────────── */
export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  const [agreed,   setAgreed]   = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const [role, setRole] = useState(null);
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const { loading, error } = useSelector((state) => state.auth);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role) { toast.error('Please select an account type'); return; }
    if (!agreed) { 
      setShowTermsError(true);
      toast.error('Please accept the Terms of Service and Privacy Policy'); 
      return; 
    }
    setShowTermsError(false);
    const mappedRole = role === 'Author and Reader' ? 'ReaderAuthor' : role;
    localStorage.setItem('selectedRole', mappedRole);
    const resultAction = await dispatch(registerUser({ 
      ...form, 
      role: mappedRole,
      acceptedTerms: agreed,
      acceptedPrivacy: agreed,
      acceptedAt: new Date().toISOString()
    }));
    if (registerUser.fulfilled.match(resultAction)) {
      navigate(getDashboardRoute(resultAction.payload.role));
    } else {
      toast.error(resultAction.payload?.message || 'Registration failed');
    }
  };

  return (
    <div
      className="h-screen w-full flex flex-col overflow-hidden relative"
      style={{ background: SAND }}
    >
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
            <p className="text-[10px] leading-none mt-0.5" style={{ color: 'rgba(0,71,65,0.5)' }}>Your World. Your Books.</p>
          </div>
        </Link>
      </motion.div>

      {/* ── Main Layout ──────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-10 w-full h-full">
        {/* Left Side - Animated Branding */}
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center relative overflow-hidden">
          
          {/* Animated Rings */}
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute w-[600px] h-[600px] border border-dashed rounded-full" style={{ borderColor: 'rgba(0,71,65,0.15)' }} 
          />
          <motion.div 
            animate={{ rotate: -360 }} 
            transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
            className="absolute w-[450px] h-[450px] border rounded-full" style={{ borderColor: 'rgba(0,71,65,0.08)' }} 
          />

          {/* Floating abstract book cards */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [-12, -8, -12] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[20%] w-24 h-32 rounded-2xl shadow-xl backdrop-blur-md flex flex-col p-3 gap-2"
            style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.8)' }}
          >
            <div className="w-full h-3 rounded bg-primary/20" />
            <div className="w-3/4 h-2 rounded bg-primary/10" />
            <div className="w-1/2 h-2 rounded bg-primary/10" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 25, 0], rotate: [15, 20, 15] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[25%] right-[20%] w-28 h-40 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col p-4 gap-2"
            style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.9)' }}
          >
            <div className="w-full h-1/2 rounded-lg bg-gradient-to-br from-primary/30 to-primary/5" />
            <div className="w-full h-3 rounded bg-primary/20 mt-2" />
            <div className="w-2/3 h-2 rounded bg-primary/10" />
          </motion.div>

          <motion.div
            animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[35%] right-[25%] w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center shadow-lg"
            style={{ background: 'rgba(200,155,60,0.15)', border: '1px solid rgba(200,155,60,0.3)' }}
          >
            <Sparkles size={20} style={{ color: GOLD }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="flex flex-col items-center relative z-10"
          >
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-64 h-64 rounded-[3rem] flex items-center justify-center overflow-hidden shadow-2xl mb-8 relative" 
              style={{ background: 'white', border: '8px solid rgba(255,255,255,0.7)' }}
            >
              <motion.div 
                animate={{ opacity: [0, 0.4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none"
              />
              <img src="/logo.png" alt="ReadSphere Logo" className="w-full h-full object-cover relative z-10" />
            </motion.div>
            
            <h2 className="text-5xl font-black mb-3 text-center" style={{ fontFamily: 'Outfit, sans-serif', color: PRIMARY }}>
              ReadSphere
            </h2>
            <p className="text-lg text-center max-w-sm" style={{ color: 'rgba(0,71,65,0.7)' }}>
              Your gateway to endless stories, powerful AI insights, and a global reading community.
            </p>
          </motion.div>
        </div>

        {/* Right Side - Form Card */}
        <div className="flex-1 flex items-center justify-center px-4 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="w-full max-w-[500px]"
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
              <UserPlus size={26} className="text-white" />
            </motion.div>
          </motion.div>

          {/* Card */}
          <div
            className="rounded-2xl px-8 py-7"
            style={{
              background: CARD_BG,
              border: `1px solid rgba(255,255,255,0.8)`,
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: `0 24px 64px rgba(0,71,65,0.1), 0 4px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)`,
            }}
          >
            {/* Title */}
            <div className="text-center mb-5">
              <h1 className="text-[26px] font-black mb-1.5" style={{ fontFamily: 'Outfit, sans-serif', color: PRIMARY }}>
                Create Your <span style={{ color: GOLD }}>Account</span>
              </h1>
              <p className="text-[13px]" style={{ color: 'rgba(0,71,65,0.55)' }}>
                Join ReadSphere and start your reading journey
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Two-column */}
              <div className="grid grid-cols-2 gap-3">
                <Field id="reg-name"     icon={User} label="Full Name" value={form.name}     onChange={set('name')}     required />
                <Field id="reg-username" icon={User} label="Username"  value={form.username} onChange={set('username')} required />
              </div>

              <Field id="reg-email" icon={Mail} label="Email Address" type="email" value={form.email} onChange={set('email')} required />

              <Field
                id="reg-pass"
                icon={Lock}
                label="Password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                required
                right={
                  <button type="button" onClick={() => setShowPass(s => !s)}>
                    <AnimatePresence mode="wait">
                      {showPass
                        ? <motion.div key="off" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><EyeOff size={15} /></motion.div>
                        : <motion.div key="on"  initial={{ rotate: 90,  opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><Eye size={15} /></motion.div>
                      }
                    </AnimatePresence>
                  </button>
                }
              />

              {/* Role Selection */}
              <div className="flex flex-col gap-2 py-1">
                <span className="text-[13px] font-semibold" style={{ color: PRIMARY }}>I want to be a:</span>
                <div className="grid grid-cols-3 gap-2">
                  {['Reader', 'Author', 'Author and Reader'].map(r => (
                    <div
                      key={r}
                      onClick={() => setRole(r)}
                      className={`flex items-center justify-center text-center py-2 px-1 rounded-lg border cursor-pointer transition-all text-[11px] leading-tight font-bold ${
                        role === r 
                          ? 'bg-primary text-white border-primary shadow-md' 
                          : 'bg-white/50 text-gray-500 border-border hover:border-primary/50'
                      }`}
                    >
                      {r}
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms */}
              <div className="flex flex-col gap-1 py-1">
                <label className="flex items-start gap-2.5 cursor-pointer group" htmlFor="terms-checkbox">
                  <input
                    type="checkbox"
                    id="terms-checkbox"
                    className="sr-only"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      if (e.target.checked) setShowTermsError(false);
                    }}
                    aria-required="true"
                    aria-describedby={showTermsError ? "terms-error" : undefined}
                  />
                  <motion.div
                    className="w-4 h-4 rounded flex items-center justify-center border mt-0.5 shrink-0 transition-colors group-focus-within:ring-2 group-focus-within:ring-offset-1 group-focus-within:ring-primary/50"
                    animate={{ background: agreed ? GOLD : 'rgba(255,255,255,0.8)', borderColor: agreed ? GOLD : BORDER }}
                    transition={{ duration: 0.15 }}
                  >
                    <AnimatePresence>
                      {agreed && (
                        <motion.svg key="chk" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                          viewBox="0 0 10 8" className="w-2.5 h-2.5" fill="none">
                          <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <span className="text-[12px] leading-relaxed" style={{ color: 'rgba(0,71,65,0.6)' }}>
                    I agree to the{' '}
                    <Link to="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline transition-all" style={{ color: GOLD }}>Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline transition-all" style={{ color: GOLD }}>Privacy Policy</Link>
                  </span>
                </label>
                <AnimatePresence>
                  {showTermsError && (
                    <motion.p 
                      id="terms-error"
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[11px] text-red-500 font-medium pl-6"
                    >
                      Please accept the Terms of Service and Privacy Policy before creating an account.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit */}
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
                      <span>Creating account…</span>
                    </motion.div>
                  ) : (
                    <motion.span key="lbl" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>Create Account</motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>

            {/* OR */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px" style={{ background: BORDER }} />
              <span className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: 'rgba(0,71,65,0.4)' }}>OR</span>
              <div className="flex-1 h-px" style={{ background: BORDER }} />
            </div>

            {/* Google */}
            <motion.button
              type="button"
              onClick={async () => {
                if (!role) { toast.error('Please select an account type first'); return; }
                if (!agreed) {
                  setShowTermsError(true);
                  toast.error('Please accept the Terms of Service and Privacy Policy');
                  return;
                }
                try {
                  const mappedRole = role === 'Author and Reader' ? 'ReaderAuthor' : role;
                  localStorage.setItem('selectedRole', mappedRole);
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: { 
                      redirectTo: window.location.origin + import.meta.env.BASE_URL + getDashboardRoute(mappedRole).substring(1),
                    },
                  });
                  if (error) throw error;
                } catch (err) { toast.error(err.message); }
              }}
              whileHover={{ y: -1, boxShadow: `0 4px 16px rgba(0,71,65,0.12)` }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-12 rounded-xl flex items-center justify-center gap-3 text-[14px] font-semibold transition-all"
              style={{ background: 'rgba(255,255,255,0.8)', border: `1px solid ${BORDER}`, color: PRIMARY }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </motion.button>

            <p className="text-center text-[13px] mt-4" style={{ color: 'rgba(0,71,65,0.5)' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-bold hover:opacity-75 transition-opacity" style={{ color: GOLD }}>Login</Link>
            </p>
          </div>
          </motion.div>
        </div>
      </div>

      {/* ── Feature bar ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="relative z-10 border-t"
        style={{ borderColor: 'rgba(0,71,65,0.1)', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex items-center justify-center max-w-3xl mx-auto">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="flex items-center gap-3 px-8 py-4 flex-1"
              style={{ borderRight: i < FEATURES.length - 1 ? `1px solid rgba(0,71,65,0.1)` : 'none' }}
            >
              <motion.div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'rgba(0,71,65,0.08)', border: '1px solid rgba(0,71,65,0.15)' }}
                animate={{ boxShadow: [`0 0 8px rgba(0,71,65,0.1)`, `0 0 16px rgba(200,155,60,0.2)`, `0 0 8px rgba(0,71,65,0.1)`] }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
              >
                <f.icon size={16} style={{ color: GOLD }} />
              </motion.div>
              <div>
                <p className="text-[13px] font-bold" style={{ color: PRIMARY }}>{f.title}</p>
                <p className="text-[11px]" style={{ color: 'rgba(0,71,65,0.5)' }}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
