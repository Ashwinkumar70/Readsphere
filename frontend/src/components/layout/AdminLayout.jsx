import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { Shield, LayoutDashboard, Users, BookOpen, Settings, LogOut, Menu, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import Avatar from '../ui/Avatar.jsx';

const adminNavLinks = [
  { icon: LayoutDashboard, label: 'Overview', to: '/admin' },
  { icon: Users, label: 'Users', to: '/admin/users' },
  { icon: BookOpen, label: 'Content', to: '/admin/content' },
  { icon: Settings, label: 'Settings', to: '/admin/settings' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-gray-900 text-white p-4">
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-primary" />
          <span className="font-bold">ReadSphere Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            className="fixed md:static inset-y-0 left-0 z-40 w-64 bg-gray-900 text-gray-300 flex flex-col h-screen"
          >
            <div className="hidden md:flex items-center gap-3 h-16 px-6 border-b border-gray-800 bg-gray-950">
              <Shield size={20} className="text-primary" />
              <span className="text-lg font-bold text-white tracking-tight">ReadSphere</span>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-4">Admin Portal</p>
              {adminNavLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <link.icon size={18} />
                  {link.label}
                </NavLink>
              ))}
            </div>

            <div className="p-4 border-t border-gray-800 bg-gray-950">
              <div className="flex items-center gap-3 mb-4 px-2">
                <Avatar src={user?.avatar} name={user?.name || 'Admin'} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@readsphere.com'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-xl transition-all"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
        {/* Admin Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-gray-800 hidden sm:block">Admin Console</h2>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-primary hover:underline font-semibold">Back to App</Link>
            <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-all">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
