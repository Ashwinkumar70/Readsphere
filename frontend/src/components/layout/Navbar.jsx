import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, Bell, ChevronDown, Menu, X,
  Sparkles, User, Settings, LogOut, CreditCard, Library
} from 'lucide-react';
import Avatar from '../ui/Avatar.jsx';
import Badge from '../ui/Badge.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice.js';

import { getDashboardRoute } from '../../utils/roleRouter.js';

const publicNavLinks = [
  { label: 'Home', to: '/' },
  { label: 'Marketplace', to: '/marketplace' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Contact', to: '/contact' },
];

const authNavLinks = [
  { label: 'Marketplace', to: '/marketplace' },
  { label: 'AI Reader', to: '/reader' }, // Using reader dashboard for AI feature link
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { notifications, unreadCount } = useSelector(state => state.userData);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = () => { setProfileOpen(false); setNotifOpen(false); };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? 'glass shadow-nav' : 'bg-white/95 backdrop-blur-md border-b border-border'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="ReadSphere Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">ReadSphere</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {isAuthenticated && user && (
              <NavLink
                to={getDashboardRoute(user.role)}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary bg-primary-50 font-semibold'
                      : 'text-muted hover:text-text hover:bg-gray-100'
                  }`
                }
              >
                Dashboard
              </NavLink>
            )}
            
            {(isAuthenticated ? authNavLinks : publicNavLinks).map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary bg-primary-50 font-semibold'
                      : 'text-muted hover:text-text hover:bg-gray-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-xl text-muted hover:text-text hover:bg-gray-100 transition-all"
            >
              <Search size={18} />
            </button>

            {/* Notifications */}
            <div className="relative" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="relative p-2 rounded-xl text-muted hover:text-text hover:bg-gray-100 transition-all"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-card border border-border overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                      <h3 className="font-bold text-text text-sm">Notifications</h3>
                      <Badge color="primary" size="xs">{unreadCount} new</Badge>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map(n => (
                          <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 border-b border-border/50 last:border-0 cursor-pointer transition-colors ${!n.is_read ? 'bg-primary-50/40' : ''}`}>
                            <p className="text-xs text-text font-medium leading-relaxed">{n.message}</p>
                            <p className="text-xs text-muted mt-0.5">{new Date(n.created_at).toLocaleDateString()}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-xs text-muted">No notifications</div>
                      )}
                    </div>
                    <div className="px-4 py-2.5 border-t border-border">
                      <Link to="/notifications" className="text-xs text-primary font-semibold hover:underline" onClick={() => setNotifOpen(false)}>
                        View all notifications →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile / Auth */}
            {isAuthenticated && user ? (
              <div className="relative" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 transition-all"
                >
                  <Avatar src={user.avatar} name={user.name} size="sm" online />
                  <ChevronDown size={14} className={`text-muted transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-card border border-border overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-border">
                        <p className="font-bold text-text text-sm">{user.name}</p>
                        <p className="text-xs text-muted">{user.email}</p>
                        {user.isPremium && (
                          <Badge color="premium" size="xs" className="mt-1.5">✦ Premium</Badge>
                        )}
                      </div>
                      {[
                        { icon: User, label: 'Profile', to: '/profile' },
                        { icon: Library, label: 'My Library', to: '/library' },
                        { icon: Sparkles, label: 'Dashboard', to: getDashboardRoute(user.role) },
                        { icon: Bell, label: 'Notifications', to: '/notifications' },
                        { icon: Settings, label: 'Settings', to: '/settings' },
                      ].map(item => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-muted hover:text-text transition-colors"
                        >
                          <item.icon size={15} />
                          <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                      ))}
                      <div className="border-t border-border">
                        <button onClick={() => { dispatch(logoutUser()); setProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-muted hover:text-red-500 transition-colors">
                          <LogOut size={15} />
                          <span className="text-sm font-medium">Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/login" className="text-sm font-semibold text-text hover:text-primary transition-colors">Log in</Link>
                <Link to="/register" className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm hover:bg-primary-600 transition-all">Sign up</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-xl text-muted hover:text-text hover:bg-gray-100 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-border overflow-hidden bg-white"
            >
              <div className="px-4 py-3 space-y-1">
                {(isAuthenticated ? authNavLinks : publicNavLinks).map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive ? 'bg-primary-50 text-primary font-semibold' : 'text-muted hover:bg-gray-50 hover:text-text'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                {!isAuthenticated && (
                  <div className="pt-2 border-t border-border flex gap-2">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 border border-primary text-primary rounded-xl text-sm font-semibold">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 bg-primary text-white rounded-xl text-sm font-semibold">
                      Register
                    </Link>
                  </div>
                )}
                {isAuthenticated && user && (
                  <div className="pt-2 border-t border-border flex gap-2">
                    <Link to={getDashboardRoute(user.role)} onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 bg-primary text-white rounded-xl text-sm font-semibold">
                      Dashboard
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
                <Search size={18} className="text-muted shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search books, authors, clubs..."
                  className="flex-1 outline-none text-sm text-text placeholder:text-muted"
                />
                <button onClick={() => setSearchOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                  <X size={16} className="text-muted" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">Trending Searches</p>
                <div className="flex flex-wrap gap-2">
                  {['Atomic Habits', 'Project Hail Mary', 'The Alchemist', 'Sapiens', 'Dune'].map(s => (
                    <span key={s} className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-text hover:bg-primary-50 hover:text-primary cursor-pointer transition-colors">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
