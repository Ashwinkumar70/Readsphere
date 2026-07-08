import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from './lib/supabase.js';
import { setAuthSession, fetchUserProfile } from './store/slices/authSlice.js';

import Navbar from './components/layout/Navbar.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Footer from './components/layout/Footer.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
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
import UploadBook from './pages/UploadBook.jsx';
import Pricing from './pages/Pricing.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import Notifications from './pages/Notifications.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Help from './pages/Help.jsx';
import Contact from './pages/Contact.jsx';
import AuthorProfile from './pages/AuthorProfile.jsx';
import NotFound from './pages/NotFound.jsx';

// Pages that use the sidebar layout
const sidebarRoutes = ['/dashboard', '/library', '/collections', '/clubs', '/bookmarks', '/notes', '/profile', '/author', '/upload', '/notifications', '/settings'];

// Pages that are standalone (no navbar/footer)
const standaloneRoutes = ['/login', '/register', '/reader'];

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
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/library" element={<MyLibrary />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/clubs" element={<Clubs />} />
                <Route path="/clubs/:id" element={<ClubDetails />} />
                <Route path="/clubs/:id/discuss" element={<ClubDiscussion />} />
                <Route path="/bookmarks" element={<MyLibrary tab="bookmarks" />} />
                <Route path="/notes" element={<MyLibrary tab="notes" />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/author" element={<AuthorDashboard />} />
                <Route path="/upload" element={<UploadBook />} />
                <Route path="/notifications" element={<Notifications />} />
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
            <Route path="/Readsphere/*" element={<Navigate to="/" replace />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/help" element={<Help />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/author/:id" element={<AuthorProfile />} />
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
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        dispatch(setAuthSession({ 
          id: session.user.id, 
          email: session.user.email,
          role: session.user.user_metadata?.role || 'Reader'
        }));
        dispatch(fetchUserProfile());
      }
    });

    // Listen for auth state changes (Google OAuth callback, login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          dispatch(setAuthSession({ 
            id: session.user.id, 
            email: session.user.email,
            role: session.user.user_metadata?.role || 'Reader'
          }));
          dispatch(fetchUserProfile());
        } else {
          dispatch(setAuthSession(null));
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return (
    <BrowserRouter>
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
