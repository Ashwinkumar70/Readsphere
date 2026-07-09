import { NavLink } from 'react-router-dom';

import {
  Home, Store, Library, Layers, Users, Bookmark,
  FileText, User, Sparkles, ChevronLeft, ChevronRight,
  PenTool, BarChart2, Upload, Shield
} from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Avatar from '../ui/Avatar.jsx';
import Badge from '../ui/Badge.jsx';

const readerLinks = [
  { icon: Home, label: 'Dashboard', to: '/dashboard' },
  { icon: Store, label: 'Marketplace', to: '/marketplace' },
  { icon: Library, label: 'My Library', to: '/library' },
  { icon: Layers, label: 'Collections', to: '/collections' },
  { icon: Users, label: 'Clubs', to: '/clubs' },
  { icon: Bookmark, label: 'Bookmarks', to: '/bookmarks' },
  { icon: FileText, label: 'Notes', to: '/notes' },
  { icon: User, label: 'Profile', to: '/profile' },
  { icon: Shield, label: 'Settings', to: '/settings' },
];

const authorLinks = [
  { icon: PenTool, label: 'Author Dashboard', to: '/author' },
  { icon: Upload, label: 'Upload Book', to: '/upload' },
  { icon: BarChart2, label: 'Analytics', to: '/author' },
];



export default function Sidebar({ collapsed: externalCollapsed, onCollapse }) {
  const [collapsed, setCollapsed] = useState(false);
  const user = useSelector(state => state.auth.user);

  const toggle = () => {
    setCollapsed(c => !c);
    onCollapse?.(!collapsed);
  };

  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : collapsed;

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 z-30 flex flex-col bg-white border-r border-border transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggle}
        className="absolute -right-3 top-6 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10"
      >
        {isCollapsed ? <ChevronRight size={12} className="text-muted" /> : <ChevronLeft size={12} className="text-muted" />}
      </button>

      <div className="flex flex-col h-full overflow-y-auto py-4">
        {/* User Mini Profile */}
        {!isCollapsed && user && (
          <div className="px-4 mb-5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-50 border border-primary-100">
              <Avatar src={user.avatar} name={user.name} size="sm" online />
              <div className="min-w-0">
                <p className="text-sm font-bold text-text truncate">{user.name?.split(' ')[0] || 'User'}</p>
                {user.isPremium && <Badge color="premium" size="xs">Premium</Badge>}
              </div>
            </div>
          </div>
        )}

        {isCollapsed && user && (
          <div className="flex justify-center mb-5 px-2">
            <Avatar src={user.avatar} name={user.name} size="sm" online />
          </div>
        )}

        {/* Reader Links */}
        <div className="flex-1 px-2 space-y-0.5">
          {!isCollapsed && (
            <p className="text-xs font-semibold text-muted uppercase tracking-wider px-3 mb-2">Reader</p>
          )}
          {readerLinks.map(link => (
            <NavLink
              key={link.label}
              to={link.to}
              title={isCollapsed ? link.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'sidebar-link-active'
                    : 'text-muted hover:text-text hover:bg-gray-100'
                } ${isCollapsed ? 'justify-center' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon size={18} className={isActive ? 'text-primary' : ''} />
                  {!isCollapsed && <span>{link.label}</span>}
                </>
              )}
            </NavLink>
          ))}

          {/* Author section */}
          {!isCollapsed && (
            <p className="text-xs font-semibold text-muted uppercase tracking-wider px-3 mb-2 mt-5">Author</p>
          )}
          {!isCollapsed && <div className="border-t border-border my-2" />}
          {authorLinks.map(link => (
            <NavLink
              key={link.label}
              to={link.to}
              title={isCollapsed ? link.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive ? 'sidebar-link-active' : 'text-muted hover:text-text hover:bg-gray-100'
                } ${isCollapsed ? 'justify-center' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon size={18} className={isActive ? 'text-primary' : ''} />
                  {!isCollapsed && <span>{link.label}</span>}
                </>
              )}
            </NavLink>
          ))}

        </div>

        {/* AI Feature Promo */}
        {!isCollapsed && (
          <div className="mx-3 mt-4 p-3 rounded-xl bg-gradient-primary text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} />
              <span className="text-xs font-bold">AI Reading Mode</span>
            </div>
            <p className="text-xs opacity-90 mb-2">Get AI explanations while you read</p>
            <NavLink
              to="/reader/1"
              className="block text-center bg-white/20 hover:bg-white/30 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors"
            >
              Try Now
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  );
}
