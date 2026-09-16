import { supabase } from '../config/supabase.js';

import { clubService } from '../services/community/clubService.js';

// @desc    Fetch all clubs
// @route   GET /api/clubs
// @access  Public
const getClubs = async (req, res, next) => {
  try {
    const clubs = await clubService.getClubs();
    res.json(clubs);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a club
// @route   POST /api/clubs
// @access  Private
const createClub = async (req, res, next) => {
  try {
    const { name, description, rules, is_private } = req.body;
    let banner_url = req.body.banner_url || null;

    if (req.file) {
      banner_url = req.file.supabaseUrl;
    }

    const club = await clubService.createClub(req.user.id, {
      name,
      description,
      banner_url,
      rules,
      is_private: is_private === 'true' || is_private === true
    });

    res.status(201).json(club);
  } catch (error) {
    next(error);
  }
};

// @desc    Join a club
// @route   POST /api/clubs/:id/join
// @access  Private
const joinClub = async (req, res, next) => {
  try {
    const clubId = req.params.id;
    const member = await clubService.joinClub(clubId, req.user.id);
    res.status(200).json({ message: 'Successfully joined the club', member });
  } catch (error) {
    res.status(400);
    next(new Error(error.message || 'Could not join club. You might already be a member.'));
  }
};

// @desc    Leave a club
// @route   POST /api/clubs/:id/leave
// @access  Private
const leaveClub = async (req, res, next) => {
  try {
    const clubId = req.params.id;
    // Check if owner
    const members = await clubService.getMembers(clubId);
    const me = members.find(m => m.user_id === req.user.id);
    
    if (me?.role === 'owner') {
      res.status(400);
      return next(new Error('Owner cannot leave the club. Transfer ownership or delete.'));
    }

    await clubService.leaveClub(clubId, req.user.id);
    res.status(200).json({ message: 'Successfully left the club' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get club discussions
// @route   GET /api/clubs/:id/messages
// @access  Private
const getClubMessages = async (req, res, next) => {
  try {
    const clubId = req.params.id;
    const { page = 1, limit = 50 } = req.query;
    
    const messages = await clubService.getMessages(clubId, parseInt(page), parseInt(limit));
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Post a message in club discussion
// @route   POST /api/clubs/:id/messages
// @access  Private
const postClubMessage = async (req, res, next) => {
  try {
    const clubId = req.params.id;
    const { content } = req.body;
    
    const message = await clubService.postMessage(clubId, req.user.id, content);
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

// @desc    Edit a message
// @route   PUT /api/clubs/messages/:msgId
// @access  Private
const editClubMessage = async (req, res, next) => {
  try {
    const { msgId } = req.params;
    const { content } = req.body;
    const message = await clubService.editMessage(msgId, req.user.id, content);
    res.json(message);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a message
// @route   DELETE /api/clubs/messages/:msgId
// @access  Private
const deleteClubMessage = async (req, res, next) => {
  try {
    const { msgId } = req.params;
    await clubService.deleteMessage(msgId, req.user.id);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update member role
// @route   PUT /api/clubs/:id/members/:userId/role
// @access  Private (Owner/Moderator only)
const updateMemberRole = async (req, res, next) => {
  try {
    const { id: clubId, userId: targetUserId } = req.params;
    const { role } = req.body;

    const members = await clubService.getMembers(clubId);
    const requester = members.find(m => m.user_id === req.user.id);

    if (!requester || (requester.role !== 'owner' && requester.role !== 'moderator')) {
      res.status(403);
      return next(new Error('Not authorized to update roles'));
    }

    const { error } = await supabase
      .from('club_members')
      .update({ role })
      .match({ club_id: clubId, user_id: targetUserId });

    if (error) throw error;
    res.json({ message: 'Role updated successfully' });
  } catch (error) {
    next(error);
  }
};

export { 
  getClubs, 
  createClub, 
  joinClub, 
  leaveClub, 
  getClubMessages,
  postClubMessage,
  editClubMessage,
  deleteClubMessage,
  updateMemberRole
};
