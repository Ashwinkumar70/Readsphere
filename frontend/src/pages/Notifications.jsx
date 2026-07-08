import { motion } from 'framer-motion';
import { Bell, BookOpen, Users, UserPlus, Heart, Award, CheckCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markNotificationRead } from '../store/slices/userSlice.js';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

const icons = {
  BookOpen, Users, UserPlus, Heart, Clock: Bell, Award, Bookmark: Heart
};

export default function Notifications() {
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading } = useSelector(state => state.userData);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkRead = (id) => {
    dispatch(markNotificationRead(id));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div variants={stagger} initial="hidden" animate="show">
        <motion.div variants={fadeUp} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">Notifications</h1>
            <p className="text-muted">Stay updated with your reading community.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" icon={CheckCircle}>Mark all as read</Button>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-border shadow-soft overflow-hidden">
          <div className="flex items-center gap-4 px-6 py-4 border-b border-border bg-gray-50/50">
            <Badge color="primary">{unreadCount} Unread</Badge>
            <button className="text-sm font-semibold text-muted hover:text-text transition-colors">All</button>
            <button className="text-sm font-semibold text-muted hover:text-text transition-colors">Mentions</button>
          </div>

          <div className="divide-y divide-border">
            {loading ? (
              <div className="p-8 text-center text-muted">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-muted">No notifications yet.</div>
            ) : (
              notifications.map((n) => {
                const Icon = icons[n.icon_type] || Bell;
                return (
                  <div key={n.id} className={`p-6 flex gap-4 transition-colors hover:bg-gray-50 cursor-pointer ${!n.is_read ? 'bg-primary-50/30' : ''}`} onClick={() => handleMarkRead(n.id)}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!n.is_read ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-muted'}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${!n.is_read ? 'font-semibold text-text' : 'text-muted-foreground'}`}>{n.message}</p>
                      <p className="text-xs text-muted mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
                    </div>
                    {!n.is_read && <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 shrink-0" />}
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
