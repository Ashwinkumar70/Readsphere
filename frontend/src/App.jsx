import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from './lib/supabase.js';
import { setAuthSession, fetchUserProfile, setAuthLoading } from './store/slices/authSlice.js';

import Navbar from './components/layout/Navbar.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Footer from './components/layout/Footer.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Marketplace from './pages/Marketplace.jsx';
import BookDetails from './pages/BookDetails.jsx';
import Reader from './pages/Reader.jsx';
import MyLibrary from './pages/MyLibrary.jsx';
import Collections from './pages/Collections.jsx';
import Clubs from './pages/Clubs.jsx';
import ClubDetails from './pages/ClubDetails.jsx';
import ClubDiscussion from './pages/ClubDiscussion.jsx';
import AuthorDashboard from './pages/AuthorDashboard.jsx';
import ReaderAuthorDashboard from './pages/ReaderAuthorDashboard.jsx';
import UploadBook from './pages/UploadBook.jsx';
import Pricing from './pages/Pricing.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import Notifications from './pages/Notifications.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Help from './pages/Help.jsx';
import Contact from './pages/Contact.jsx';
import AuthorProfile from './pages/AuthorProfile.jsx';
import TermsOfService from './pages/TermsOfService.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import NotFound from './pages/NotFound.jsx';

// Pages that use the sidebar layout
const sidebarRoutes = ['/reader', '/reader-author', '/library', '/collections', '/clubs', '/bookmarks', '/notes', '/profile', '/author', '/upload', '/notifications', '/settings'];

// Pages that are standalone (no navbar/footer)
const standaloneRoutes = ['/login', '/register', '/reader/', '/forgot-password', '/reset-password'];

function AppLayout() {
  const location = useLocation();
  const path = location.pathname;

  const isStandalone = standaloneRoutes.some(r => path.startsWith(r));
  const hasSidebar = sidebarRoutes.some(r => path.startsWith(r));

  if (isStandalone) {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reader/:id" element={<Reader />} />
        </Routes>
      </AnimatePresence>
    );
  }

  const isAdminRoute = path.startsWith('/admin');
  if (isAdminRoute) {
    return (
      <Routes location={location} key="admin-routes">
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          {/* Future admin sub-routes can go here */}
        </Route>
      </Routes>
    );
  }

  if (hasSidebar) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex pt-16">
          <Sidebar />
          <main className="flex-1 ml-60 min-h-screen transition-all duration-300">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/reader" element={<ProtectedRoute allowedRoles={['Reader', 'ReaderAuthor']}><Dashboard /></ProtectedRoute>} />
                <Route path="/reader-author" element={<ProtectedRoute allowedRoles={['ReaderAuthor']}><ReaderAuthorDashboard /></ProtectedRoute>} />
                <Route path="/author" element={<ProtectedRoute allowedRoles={['Author', 'ReaderAuthor']}><AuthorDashboard /></ProtectedRoute>} />
                
                <Route path="/library" element={<ProtectedRoute><MyLibrary /></ProtectedRoute>} />
                <Route path="/collections" element={<ProtectedRoute><Collections /></ProtectedRoute>} />
                <Route path="/clubs" element={<ProtectedRoute><Clubs /></ProtectedRoute>} />
                <Route path="/clubs/:id" element={<ProtectedRoute><ClubDetails /></ProtectedRoute>} />
                <Route path="/clubs/:id/discuss" element={<ProtectedRoute><ClubDiscussion /></ProtectedRoute>} />
                <Route path="/bookmarks" element={<ProtectedRoute><MyLibrary tab="bookmarks" /></ProtectedRoute>} />
                <Route path="/notes" element={<ProtectedRoute><MyLibrary tab="notes" /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/upload" element={<ProtectedRoute><UploadBook /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>
    );
  }

  // Public layout with navbar + footer
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            {/* OAuth callback route - handles session via onAuthStateChange and redirects */}
            <Route path="/auth/callback" element={<div className="p-6 text-center">Authenticating...</div>} />
            {/* Gracefully handle old local bookmarks to /Readsphere/ */}
            <Route path="/Readsphere/*" element={<Navigate to="/" replace />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/help" element={<Help />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/author/:id" element={<AuthorProfile />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initial session check is now completely handled by onAuthStateChange's INITIAL_SESSION event
    // in Supabase v2, so we don't need a separate getSession() call here.

    // Listen for auth state changes (Google OAuth callback, login, logout, refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
          if (session) {
            dispatch(setAuthSession(session.user));
            dispatch(fetchUserProfile());
          } else {
            dispatch(setAuthLoading(false));
          }
        } else if (event === 'SIGNED_OUT') {
          dispatch(setAuthSession(null));
          dispatch(setAuthLoading(false));
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#0F172A',
            color: '#F8FAFC',
            fontSize: '14px',
            fontWeight: 500,
          },
        }}
      />
      <AppLayout />
    </BrowserRouter>
  );
}
