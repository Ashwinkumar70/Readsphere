import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpen, Headphones, Users, Sparkles,
  TrendingUp, Brain, Globe, Zap, Award
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';

/* ─── Config ─────────────────────────────────────────────────────── */
const PRIMARY  = '#004741';
const HOVER    = '#006A63';
const GOLD     = '#C89B3C';
const SAND     = '#F0EDE4';
const BORDER   = '#DAD7CF';

/* ─── Floating Particles ────────────────────────────────────────── */
const PARTICLES = [
  { size: 5,  left: '8%',  top: '12%', delay: 0,   dur: 6.5, type: 'gold'  },
  { size: 8,  left: '88%', top: '8%',  delay: 1.2, dur: 8,   type: 'teal'  },
  { size: 4,  left: '78%', top: '85%', delay: 2.1, dur: 5.5, type: 'gold'  },
  { size: 9,  left: '5%',  top: '78%', delay: 0.8, dur: 7,   type: 'teal'  },
  { size: 4,  left: '52%', top: '94%', delay: 3.3, dur: 5.2, type: 'gold'  },
  { size: 6,  left: '93%', top: '45%', delay: 1.7, dur: 6.8, type: 'teal'  },
  { size: 3,  left: '22%', top: '90%', delay: 2.5, dur: 5.8, type: 'gold'  },
  { size: 5,  left: '63%', top: '6%',  delay: 0.5, dur: 7.2, type: 'teal'  },
  { size: 4,  left: '40%', top: '4%',  delay: 1.4, dur: 4.8, type: 'gold'  },
  { size: 6,  left: '15%', top: '48%', delay: 3.8, dur: 6.3, type: 'teal'  },
  { size: 3,  left: '70%', top: '55%', delay: 0.3, dur: 5,   type: 'gold'  },
  { size: 5,  left: '30%', top: '20%', delay: 2.8, dur: 6.8, type: 'teal'  },
];

/* ─── Book Showcase Cards ───────────────────────────────────────── */
const BOOKS = [
  { title: 'Atomic Habits',      author: 'James Clear',   color: GOLD     },
  { title: 'Midnight Library',   author: 'Matt Haig',      color: PRIMARY  },
  { title: 'Thinking Fast/Slow', author: 'D. Kahneman',   color: '#8B6914' },
  { title: 'Deep Work',          author: 'Cal Newport',    color: '#1B3A4B' },
];

/* ─── Stats (animate up) ────────────────────────────────────────── */
const STATS = [
  { value: '1.2M', label: 'Readers',   icon: Users   },
  { value: '50K+', label: 'Books',     icon: BookOpen },
  { value: '98%',  label: 'Satisfied', icon: Sparkles  },
];

/* ─── Features ──────────────────────────────────────────────────── */
const FEATURES = [
  { icon: Brain,      label: 'AI Recommendations', color: GOLD    },
  { icon: Headphones, label: 'AI Audiobooks',       color: PRIMARY },
  { icon: Globe,      label: 'Reading Clubs',       color: HOVER   },
  { icon: Zap,        label: 'Instant Summaries',   color: '#8B6914'},
];

/* ─── Particle ──────────────────────────────────────────────────── */
function Particle({ size, left, top, delay, dur, type }) {
  const color = type === 'gold'
    ? `rgba(200,155,60,${0.3 + size * 0.03})`
    : `rgba(0,71,65,${0.25 + size * 0.02})`;

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, left, top, background: color }}
      animate={{
        y:       [0, -(10 + size * 2), 0],
        x:       [0, size * 1.5, -size, 0],
        opacity: [0.3, 0.8, 0.3],
        scale:   [1, 1.4, 1],
      }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ─── Animated Book Card (3D hover) ────────────────────────────── */
function BookCard3D({ book, index, isActive, onHover }) {
  const cardRef = useRef(null);
  const rotateX = useSpring(0, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 });

  const handleMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
    const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
    rotateX.set(-dy * 8);
    rotateY.set(dx  * 8);
  }, [rotateX, rotateY]);

  const handleLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onHoverStart={() => onHover(index)}
      onHoverEnd={() => onHover(null)}
      initial={{ opacity: 0, x: -30, rotateY: -15 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{ delay: 0.4 + index * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.03, zIndex: 10 }}
      style={{
        rotateX, rotateY,
        transformPerspective: 800,
        transformStyle: 'preserve-3d',
      }}
      className="relative flex items-center gap-3 p-3 rounded-2xl cursor-pointer select-none"
      sx={{ background: 'transparent' }}
    >
      {/* Glass card bg */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{
          background: isActive
            ? 'rgba(255,255,255,0.85)'
            : 'rgba(255,255,255,0.55)',
          boxShadow: isActive
            ? `0 8px 32px ${book.color}25, 0 2px 8px rgba(0,0,0,0.06)`
            : '0 2px 8px rgba(0,0,0,0.04)',
          borderColor: isActive ? book.color + '60' : BORDER,
        }}
        transition={{ duration: 0.25 }}
        style={{ border: '1px solid', backdropFilter: 'blur(12px)' }}
      />

      {/* Book spine */}
      <motion.div
        className="relative shrink-0 rounded-lg overflow-hidden"
        style={{ width: 36, height: 50, background: book.color, flexShrink: 0 }}
        animate={{ boxShadow: isActive ? `4px 4px 16px ${book.color}50` : '2px 2px 8px rgba(0,0,0,0.15)' }}
        transition={{ duration: 0.25 }}
      >
        {/* Spine shine */}
        <div className="absolute left-0 top-0 w-1.5 h-full bg-white/10" />
        <div className="absolute top-0 left-0 w-full h-4 bg-white/8" style={{ filter: 'blur(1px)' }} />
        {/* Text lines */}
        <div className="absolute inset-0 flex flex-col justify-center gap-1 px-1.5 pt-4">
          <div className="h-[1.5px] bg-white/30 rounded-full" />
          <div className="h-[1.5px] bg-white/20 rounded-full w-3/4" />
          <div className="h-[1.5px] bg-white/15 rounded-full w-1/2" />
        </div>
        {/* Animated shimmer on hover */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              key="shimmer"
              className="absolute inset-0"
              style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)' }}
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 0.6 }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Info */}
      <div className="relative flex-1 min-w-0">
        <motion.p
          className="text-[13px] font-bold leading-tight truncate"
          animate={{ color: isActive ? book.color : PRIMARY }}
          transition={{ duration: 0.2 }}
        >
          {book.title}
        </motion.p>
        <p className="text-[11px] text-gray-500 truncate mt-0.5">{book.author}</p>
      </div>

      {/* Trending badge */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="relative flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold text-white"
            style={{ background: book.color, flexShrink: 0 }}
          >
            <TrendingUp size={8} />
            Hot
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Central AI Orb ────────────────────────────────────────────── */
function AiOrb({ mode }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
      {/* Outer pulsing halos */}
      {[1, 2, 3].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width:  120 + i * 40,
            height: 120 + i * 40,
            border: `1px solid rgba(200,155,60,${0.18 - i * 0.04})`,
          }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.9, 0.4], rotate: i % 2 === 0 ? [0, 180] : [0, -180] }}
          transition={{ duration: 4 + i * 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
        />
      ))}

      {/* Inner glowing orb */}
      <motion.div
        className="relative z-10 flex items-center justify-center rounded-full"
        style={{ width: 90, height: 90, background: `linear-gradient(135deg, ${PRIMARY} 0%, ${HOVER} 100%)` }}
        animate={{
          boxShadow: [
            `0 0 24px ${PRIMARY}40, 0 0 8px ${PRIMARY}20`,
            `0 0 48px ${GOLD}40, 0 0 16px ${GOLD}20`,
            `0 0 24px ${PRIMARY}40, 0 0 8px ${PRIMARY}20`,
          ],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.08 }}
      >
        {/* Glass highlight */}
        <div className="absolute top-2.5 left-3.5 w-6 h-4 rounded-full bg-white/15" style={{ filter: 'blur(3px)' }} />

        {/* Rotating dashed ring */}
        <motion.div
          className="absolute rounded-full"
          style={{ width: 76, height: 76, border: `1.5px dashed rgba(200,155,60,0.45)` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
        {/* Counter-rotating dots ring */}
        <motion.div
          className="absolute rounded-full"
          style={{ width: 60, height: 60, border: '1px dotted rgba(255,255,255,0.2)' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
        />

        <BookOpen size={24} className="text-white relative z-10" style={{ opacity: 0.95 }} />

        {/* Mode label that changes */}
        <motion.div
          key={mode}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.3 }}
          className="absolute -bottom-8 whitespace-nowrap text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: GOLD, color: 'white', letterSpacing: '0.05em' }}
        >
          {mode === 'login' ? '✦ AI READER' : '✦ JOIN FREE'}
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─── Animated Stat ─────────────────────────────────────────────── */
function StatBadge({ stat, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.9 + index * 0.12, type: 'spring', stiffness: 240, damping: 20 }}
      whileHover={{ y: -3, scale: 1.06 }}
      className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.7)',
        border: `1px solid ${BORDER}`,
        backdropFilter: 'blur(12px)',
        boxShadow: '0 2px 12px rgba(0,71,65,0.06)',
      }}
    >
      <motion.div
        animate={{ color: [PRIMARY, GOLD, PRIMARY] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.8 }}
      >
        <stat.icon size={16} />
      </motion.div>
      <span className="text-[15px] font-black" style={{ color: PRIMARY }}>{stat.value}</span>
      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">{stat.label}</span>
    </motion.div>
  );
}

/* ─── Feature Pill ──────────────────────────────────────────────── */
function FeaturePill({ feat, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.1 + index * 0.1, type: 'spring', stiffness: 240, damping: 20 }}
      whileHover={{ scale: 1.06, y: -2 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer"
      style={{
        background: hovered ? feat.color : 'rgba(255,255,255,0.75)',
        border: `1px solid ${hovered ? feat.color : BORDER}`,
        color: hovered ? 'white' : feat.color,
        backdropFilter: 'blur(8px)',
        boxShadow: hovered ? `0 4px 16px ${feat.color}40` : '0 1px 4px rgba(0,0,0,0.04)',
        transition: 'background 0.2s, color 0.2s, box-shadow 0.2s, border-color 0.2s',
      }}
    >
      <motion.div
        animate={{ rotate: hovered ? [0, -10, 10, 0] : 0 }}
        transition={{ duration: 0.4 }}
      >
        <feat.icon size={13} />
      </motion.div>
      {feat.label}
    </motion.div>
  );
}

/* ─── Typing Tagline ────────────────────────────────────────────── */
const TAGLINES = [
  'Read Smarter with AI',
  'Discover New Worlds',
  'Join 1.2M+ Readers',
  'Learn While You Read',
];

function TypingTagline() {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const target = TAGLINES[idx];
    if (typing) {
      if (displayed.length < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 55);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 2000);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(d => d.slice(0, -1)), 35);
        return () => clearTimeout(t);
      } else {
        setIdx(i => (i + 1) % TAGLINES.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, idx]);

  return (
    <span>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
        className="inline-block w-0.5 h-[1.1em] ml-0.5 align-middle rounded-full"
        style={{ background: GOLD, verticalAlign: 'middle' }}
      />
    </span>
  );
}

/* ─── Main Panel ────────────────────────────────────────────────── */
export default function AuthLeftPanel({ mode = 'login' }) {
  const [activeBook, setActiveBook] = useState(null);

  return (
    <motion.div
      initial={{ x: '-100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="hidden lg:flex w-[45%] h-screen relative overflow-hidden flex-col"
      style={{ backgroundColor: SAND }}
    >

      {/* ── Deep ambient gradient blobs ──────────────────── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, rgba(0,71,65,0.07) 0%, transparent 60%)`, top: '5%', left: '50%', transform: 'translateX(-50%)' }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute pointer-events-none"
        style={{ width: 450, height: 450, borderRadius: '50%', background: `radial-gradient(circle, rgba(200,155,60,0.08) 0%, transparent 60%)`, bottom: '0%', right: '-15%' }}
        animate={{ scale: [1, 1.12, 1], rotate: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute pointer-events-none"
        style={{ width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle, rgba(0,71,65,0.05) 0%, transparent 60%)`, top: '60%', left: '-5%' }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* ── Dot grid ─────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,71,65,0.12) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
          opacity: 0.5,
        }}
      />

      {/* ── Floating particles ────────────────────────────── */}
      {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

      {/* ── Logo ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-8 left-8 z-20"
      >
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${HOVER} 100%)` }}
            whileHover={{ scale: 1.08, rotate: -6 }}
            animate={{ boxShadow: [`0 4px 16px ${PRIMARY}30`, `0 4px 24px ${GOLD}40`, `0 4px 16px ${PRIMARY}30`] }}
            transition={{ boxShadow: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
          >
            <BookOpen size={17} className="text-white" />
          </motion.div>
          <motion.span
            className="text-[18px] font-black tracking-tight"
            style={{ fontFamily: 'Outfit, sans-serif', color: PRIMARY }}
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            ReadSphere
          </motion.span>
        </Link>
      </motion.div>

      {/* ── Mode switcher badge ───────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: -8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="absolute top-8 right-8 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
          style={{ background: `${GOLD}20`, border: `1px solid ${GOLD}40`, color: GOLD }}
        >
          <Award size={11} />
          {mode === 'login' ? 'Welcome back' : 'Join free today'}
        </motion.div>
      </AnimatePresence>

      {/* ── Main content ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 pt-20 pb-10 gap-4 overflow-hidden">

        {/* AI Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <AiOrb mode={mode} />
        </motion.div>

        {/* Typing headline */}
        <motion.div
          className="text-center max-w-[300px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-[26px] font-black tracking-tight leading-tight" style={{ fontFamily: 'Outfit, sans-serif', color: PRIMARY }}>
            <TypingTagline />
          </h2>
          <motion.p
            className="text-[14px] leading-relaxed mt-2"
            style={{ color: '#6B7280' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
          >
            {mode === 'login'
              ? 'Your reading journey continues here.'
              : 'Discover, read, and grow with 1.2M readers.'}
          </motion.p>
        </motion.div>

        {/* Stats row */}
        <div className="flex gap-3 w-full justify-center">
          {STATS.map((s, i) => <StatBadge key={s.label} stat={s} index={i} />)}
        </div>

        {/* Book stack — interactive */}
        <motion.div
          className="w-full max-w-[280px] flex flex-col gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {BOOKS.map((book, i) => (
            <BookCard3D
              key={book.title}
              book={book}
              index={i}
              isActive={activeBook === i}
              onHover={setActiveBook}
            />
          ))}
        </motion.div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 justify-center max-w-[300px]">
          {FEATURES.map((f, i) => <FeaturePill key={f.label} feat={f} index={i} />)}
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 pb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.5 }}
      >
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: GOLD }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-[12px] font-medium" style={{ color: '#9CA3AF' }}>
          Trusted by 1.2M+ readers worldwide
        </span>
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: PRIMARY }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
      </motion.div>

      {/* ── Right edge gradient fade ──────────────────────── */}
      <div
        className="absolute inset-y-0 right-0 w-px pointer-events-none"
        style={{ background: `linear-gradient(to bottom, transparent, ${BORDER}, transparent)` }}
      />
    </motion.div>
  );
}
