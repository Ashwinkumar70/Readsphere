import { supabase } from '../config/supabase.js';

// ==========================================
// NOTIFICATIONS
// ==========================================

// @desc    Get all notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const from = (page - 1) * limit;
    const to = from + parseInt(limit) - 1;

    const { data: notifications, error, count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    const unreadCount = notifications.filter(n => !n.is_read).length;

    res.json({
      notifications,
      total: count,
      unreadCount,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markNotificationRead = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id) // Ensure user only updates their own notifications
      .select()
      .single();

    if (error || !data) {
      res.status(404);
      throw new Error('Notification not found');
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllNotificationsRead = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, updated_at: new Date().toISOString() })
      .eq('user_id', req.user.id)
      .eq('is_read', false);

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// MESSAGES (Direct Messages)
// ==========================================

// @desc    Get direct message conversation between two users
// @route   GET /api/notifications/messages/:userId
// @access  Private
const getDirectMessages = async (req, res, next) => {
  try {
    const otherUserId = req.params.userId;

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*, sender:users!sender_id(name, avatar_url)')
      .is('club_id', null) // Only direct messages (not club messages)
      .or(
        `and(sender_id.eq.${req.user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${req.user.id})`
      )
      .order('created_at', { ascending: true });

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Send a direct message
// @route   POST /api/notifications/messages
// @access  Private
const sendDirectMessage = async (req, res, next) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      res.status(400);
      throw new Error('Receiver ID and content are required');
    }

    if (receiverId === req.user.id) {
      res.status(400);
      throw new Error('Cannot send a message to yourself');
    }

    // Verify receiver exists
    const { data: receiver, error: receiverError } = await supabase
      .from('users')
      .select('id')
      .eq('id', receiverId)
      .single();

    if (receiverError || !receiver) {
      res.status(404);
      throw new Error('Recipient user not found');
    }

    const { data: message, error } = await supabase
      .from('messages')
      .insert([{
        sender_id: req.user.id,
        receiver_id: receiverId,
        content,
        club_id: null // Direct message, not club-bound
      }])
      .select()
      .single();

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    // Create a notification for the receiver
    await supabase.from('notifications').insert([{
      user_id: receiverId,
      type: 'new_message',
      content: `You have a new message from ${req.user.name || 'a user'}.`
    }]);

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all unique conversations for the current user
// @route   GET /api/notifications/messages
// @access  Private
const getConversations = async (req, res, next) => {
  try {
    // Fetch all messages involving this user (as sender or receiver), excluding club messages
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*, sender:users!sender_id(id, name, avatar_url), receiver:users!receiver_id(id, name, avatar_url)')
      .is('club_id', null)
      .or(`sender_id.eq.${req.user.id},receiver_id.eq.${req.user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    // Deduplicate: keep only the latest message per conversation partner
    const conversationsMap = new Map();
    for (const msg of messages) {
      const partnerId = msg.sender_id === req.user.id ? msg.receiver_id : msg.sender_id;
      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, msg);
      }
    }

    const conversations = Array.from(conversationsMap.values());
    res.json(conversations);
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ANNOUNCEMENTS (Admin sends to all users)
// ==========================================

// @desc    Send an announcement to all users (Admin only)
// @route   POST /api/notifications/announcements
// @access  Admin
const sendAnnouncement = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content) {
      res.status(400);
      throw new Error('Announcement content is required');
    }

    // Fetch all active user IDs
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .eq('is_active', true);

    if (usersError) {
      res.status(400);
      throw new Error(usersError.message);
    }

    // Bulk-insert a notification for every user
    const notificationRows = users.map(u => ({
      user_id: u.id,
      type: 'announcement',
      content
    }));

    const { error: notifError } = await supabase
      .from('notifications')
      .insert(notificationRows);

    if (notifError) {
      res.status(400);
      throw new Error(notifError.message);
    }

    res.status(201).json({
      message: `Announcement sent to ${users.length} users`,
      content
    });
  } catch (error) {
    next(error);
  }
};

export {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getDirectMessages,
  sendDirectMessage,
  getConversations,
  sendAnnouncement,
};
