// animations/authAnimations.js — Premium cinematic auth animations

// Page-level card entrance
export const cardVariants = {
  hidden:  { opacity: 0, y: 40, scale: 0.96, filter: 'blur(8px)' },
  visible: {
    opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

// Staggered form fields container
export const formContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

// Individual form field
export const formItem = {
  hidden:  { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

// Slide in from right (for step wizard)
export const stepVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
    filter: 'blur(4px)',
  }),
  center: {
    x: 0, opacity: 1, filter: 'blur(0px)',
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (direction) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    filter: 'blur(4px)',
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  }),
};

// Floating label animation
export const labelActive   = { top: 8,  fontSize: '11px', color: '#004741', fontWeight: '600' };
export const labelInactive = { top: 17, fontSize: '15px', color: '#9ca3af', fontWeight: '400' };

// Success checkmark draw
export const checkDraw = {
  hidden:  { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: { duration: 0.5, delay: 0.3, ease: 'easeOut' } },
};

// Slide up with spring
export const springUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 20, delay: i * 0.08 },
  }),
};

// Scale pop (for badges, pills)
export const scalePop = {
  hidden:  { scale: 0, opacity: 0 },
  visible: (i = 0) => ({
    scale: 1, opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 18, delay: i * 0.06 },
  }),
};
