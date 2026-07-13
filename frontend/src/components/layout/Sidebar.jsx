import { NavLink } from 'react-router-dom';
import {
  Home, Store, Library, Layers, Users, Bookmark,
  FileText, User, Sparkles, ChevronLeft, ChevronRight,
  PenTool, BarChart2, Upload, Shield, Play, Bell, BookOpen, CheckCircle, TrendingUp, IndianRupee, Star,
  Compass, History, Target, Flag, Edit3, Search
} from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Avatar from '../ui/Avatar.jsx';
import Badge from '../ui/Badge.jsx';

const readerLinks = [
  { group: 'Workspace' },
  { icon: Home, label: 'Dashboard', to: '/reader' },
  { group: 'Reading' },
  { icon: Play, label: 'Continue Reading', to: '/library' },
  { icon: Library, label: 'Library', to: '/library' },
  { icon: Layers, label: 'Collections', to: '/collections' },
  { icon: Bookmark, label: 'Wishlist', to: '/bookmarks' },
  { icon: History, label: 'History', to: '/library' },
  { group: 'Marketplace' },
  { icon: Compass, label: 'Discover', to: '/marketplace' },
  { icon: User, label: 'Authors', to: '/marketplace' },
  { icon: BookOpen, label: 'Genres', to: '/marketplace' },
  { icon: Star, label: 'Best Sellers', to: '/marketplace' },
  { group: 'Community' },
  { icon: Users, label: 'Book Clubs', to: '/clubs' },
  { icon: Target, label: 'Challenges', to: '/reader' },
  { icon: Users, label: 'Friends', to: '/profile' },
  { group: 'AI Tools' },
  { icon: Sparkles, label: 'AI Reader', to: '/reader/1' },
  { icon: FileText, label: 'Summarize', to: '/reader/1' },
  { icon: Compass, label: 'Translate', to: '/reader/1' },
  { icon: BookOpen, label: 'Quiz', to: '/reader/1' },
  { group: 'Account' },
  { icon: Bell, label: 'Notifications', to: '/notifications' },
  { icon: User, label: 'Profile', to: '/profile' },
  { icon: Shield, label: 'Settings', to: '/settings' },
];

const authorLinks = [
  { group: 'Workspace' },
  { icon: Home, label: 'Studio Overview', to: '/author' },
  { group: 'Publishing' },
  { icon: Upload, label: 'Upload Book', to: '/upload' },
  { icon: Edit3, label: 'Drafts', to: '/upload' },
  { icon: CheckCircle, label: 'Published', to: '/upload' },
  { group: 'Analytics' },
  { icon: IndianRupee, label: 'Revenue', to: '/author' },
  { icon: TrendingUp, label: 'Sales & Downloads', to: '/author' },
  { icon: BarChart2, label: 'Reader Insights', to: '/author' },
  { group: 'Community' },
  { icon: Star, label: 'Reviews', to: '/author' },
  { icon: Users, label: 'Followers', to: '/author' },
  { group: 'AI Tools' },
  { icon: Sparkles, label: 'AI Author Studio', to: '/author' },
  { icon: Edit3, label: 'Marketing Copy', to: '/author' },
  { icon: Search, label: 'SEO Suggestions', to: '/author' },
  { group: 'Account' },
  { icon: Bell, label: 'Notifications', to: '/notifications' },
  { icon: User, label: 'Profile', to: '/profile' },
  { icon: Shield, label: 'Settings', to: '/settings' },
];

const readerAuthorLinks = [
  { group: 'Workspace' },
  { icon: Home, label: 'Morning Brief', to: '/reader-author' },
  { group: 'Reading' },
  { icon: Play, label: 'Continue Reading', to: '/library' },
  { icon: Library, label: 'Library', to: '/library' },
  { icon: Compass, label: 'Marketplace', to: '/marketplace' },
  { group: 'Publishing' },
  { icon: Upload, label: 'Upload Book', to: '/upload' },
  { icon: CheckCircle, label: 'My Books', to: '/upload' },
  { icon: IndianRupee, label: 'Revenue & Sales', to: '/author' },
  { group: 'Community' },
  { icon: Users, label: 'Book Clubs', to: '/clubs' },
  { icon: Star, label: 'Reviews', to: '/author' },
  { group: 'AI Tools' },
  { icon: Sparkles, label: 'AI Workspace', to: '/reader/1' },
  { group: 'Account' },
  { icon: Bell, label: 'Notifications', to: '/notifications' },
  { icon: User, label: 'Profile', to: '/profile' },
  { icon: Shield, label: 'Settings', to: '/settings' },
];

export default function Sidebar({ collapsed: externalCollapsed, onCollapse }) {
  const [collapsed, setCollapsed] = useState(false);
  const user = useSelector(state => state.auth.user);

  const toggle = () => {
    setCollapsed(c => !c);
    onCollapse?.(!collapsed);
  };

  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : collapsed;
  
  let currentLinks = readerLinks;
  if (user?.role === 'Author') currentLinks = authorLinks;
  if (user?.role === 'ReaderAuthor') currentLinks = readerAuthorLinks;

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 z-30 flex flex-col bg-white border-r border-border transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={toggle}
        className="absolute -right-3 top-6 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center shadow-soft hover:shadow-md transition-all z-10 hover:bg-gray-50 group"
      >
        {isCollapsed ? (
          <ChevronRight size={14} className="text-muted group-hover:text-text transition-colors" />
        ) : (
          <ChevronLeft size={14} className="text-muted group-hover:text-text transition-colors" />
        )}
      </button>

      <div className="flex flex-col h-full overflow-y-auto py-6 custom-scrollbar">
        {/* User Mini Profile */}
        {!isCollapsed && user && (
          <div className="px-5 mb-8">
            <div className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-border">
              <Avatar src={user.avatar} name={user.name} size="md" online />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-text truncate">{user.name}</p>
                <p className="text-xs text-muted truncate">{user.role}</p>
              </div>
              {user.isPremium && <Badge color="premium" size="xs">PRO</Badge>}
            </div>
          </div>
        )}

        {isCollapsed && user && (
          <div className="flex justify-center mb-8 px-2">
            <Avatar src={user.avatar} name={user.name} size="sm" online />
          </div>
        )}

        {/* Global Search Mock (Icon only when collapsed) */}
        <div className={`px-4 mb-6 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className="flex items-center gap-2 bg-gray-50 text-muted px-3 py-2 rounded-xl border border-gray-100 hover:border-border transition-colors cursor-pointer">
            <Search size={16} />
            {!isCollapsed && <span className="text-sm font-medium">Search...</span>}
            {!isCollapsed && <span className="ml-auto text-[10px] bg-white border border-border px-1.5 py-0.5 rounded text-muted">Ctrl K</span>}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1 pb-8">
          {currentLinks.map((item, index) => {
            if (item.group) {
              if (isCollapsed) return <div key={index} className="h-4" />; // Spacer for collapsed
              return (
                <div key={index} className="px-3 pt-4 pb-1">
                  <p className="text-[11px] font-bold text-muted uppercase tracking-wider">{item.group}</p>
                </div>
              );
            }

            const { icon: Icon, label, to } = item;
            return (
              <NavLink
                key={label + to}
                to={to}
                title={isCollapsed ? label : undefined}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-out ${
                    isActive
                      ? 'text-primary bg-primary/5 shadow-inner-soft'
                      : 'text-muted hover:text-text hover:bg-gray-50'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Indicator Left Bar */}
                    {isActive && !isCollapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                    )}
                    
                    <Icon size={18} className={`transition-colors ${isActive ? 'text-primary' : 'text-muted group-hover:text-text'}`} strokeWidth={isActive ? 2.5 : 2} />
                    {!isCollapsed && <span>{label}</span>}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

