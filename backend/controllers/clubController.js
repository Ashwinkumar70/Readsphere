import { supabase } from '../config/supabase.js';

// @desc    Fetch all clubs
// @route   GET /api/clubs
// @access  Public
const getClubs = async (req, res, next) => {
  try {
    const { data: clubs, error } = await supabase
      .from('clubs')
      .select('*, owner:users!owner_id(name, avatar_url)')
      .eq('is_public', true)
      .eq('is_active', true);

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

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
    const { name, description, is_public } = req.body;
    let image_url = req.body.image_url || null;

    if (req.file) {
      image_url = req.file.supabaseUrl;
    }

    const isPublic = is_public !== undefined ? (is_public === 'true' || is_public === true) : true;

    const { data: club, error } = await supabase
      .from('clubs')
      .insert([
        {
          owner_id: req.user.id,
          name,
          description,
          image_url,
          is_public: isPublic
        }
      ])
      .select()
      .single();

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    // Automatically add owner as a member
    await supabase
      .from('club_members')
      .insert([
        {
          club_id: club.id,
          user_id: req.user.id,
          role: 'Owner'
        }
      ]);

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
    const { invite_token } = req.query;

    const { data: club, error: clubError } = await supabase
      .from('clubs')
      .select('is_public')
      .eq('id', clubId)
      .single();

    if (clubError || !club) {
      res.status(404);
      throw new Error('Club not found');
    }

    // For private clubs, normally we'd verify the invite link/token here.
    if (!club.is_public && !invite_token) {
      res.status(403);
      throw new Error('This club is private and requires an invite link');
    }
    
    const { data: existingMember } = await supabase
      .from('club_members')
      .select('user_id')
      .eq('club_id', clubId)
      .eq('user_id', req.user.id)
      .single();

    if (existingMember) {
      res.status(400);
      throw new Error('You are already a member of this club');
    }

    const { data: member, error } = await supabase
      .from('club_members')
      .insert([{ club_id: clubId, user_id: req.user.id, role: 'Member' }])
      .select()
      .single();

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.status(200).json({ message: 'Successfully joined the club', member });
  } catch (error) {
    next(error);
  }
};

// @desc    Leave a club
// @route   POST /api/clubs/:id/leave
// @access  Private
const leaveClub = async (req, res, next) => {
  try {
    const clubId = req.params.id;

    // Check if the user is the owner (owners usually cannot leave without transferring ownership)
    const { data: memberCheck } = await supabase
      .from('club_members')
      .select('role')
      .eq('club_id', clubId)
      .eq('user_id', req.user.id)
      .single();

    if (memberCheck?.role === 'Owner') {
      res.status(400);
      throw new Error('Owner cannot leave the club. Transfer ownership or delete the club.');
    }

    const { error } = await supabase
      .from('club_members')
      .delete()
      .eq('club_id', clubId)
      .eq('user_id', req.user.id);

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.status(200).json({ message: 'Successfully left the club' });
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

    const { data: isMember } = await supabase
      .from('club_members')
      .select('*')
      .eq('club_id', clubId)
      .eq('user_id', req.user.id)
      .single();

    if (!isMember) {
      res.status(403);
      throw new Error('Must be a member to post in discussions');
    }

    const { data: message, error } = await supabase
      .from('messages')
      .insert([{ 
        sender_id: req.user.id, 
        club_id: clubId, 
        content 
      }])
      .select()
      .single();

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.status(201).json(message);
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

    const { data: isMember } = await supabase
      .from('club_members')
      .select('*')
      .eq('club_id', clubId)
      .eq('user_id', req.user.id)
      .single();

    if (!isMember) {
      res.status(403);
      throw new Error('Must be a member to view discussions');
    }

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*, sender:users!sender_id(name, avatar_url)')
      .eq('club_id', clubId)
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

// @desc    Update member role (Moderators logic)
// @route   PUT /api/clubs/:id/members/:userId/role
// @access  Private (Owner/Moderator only)
const updateMemberRole = async (req, res, next) => {
  try {
    const { id: clubId, userId: targetUserId } = req.params;
    const { role } = req.body;

    // Check requester role
    const { data: requester } = await supabase
      .from('club_members')
      .select('role')
      .eq('club_id', clubId)
      .eq('user_id', req.user.id)
      .single();

    if (!requester || (requester.role !== 'Owner' && requester.role !== 'Moderator')) {
      res.status(403);
      throw new Error('Not authorized to update roles');
    }

    const { error } = await supabase
      .from('club_members')
      .update({ role })
      .eq('club_id', clubId)
      .eq('user_id', targetUserId);

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    res.json({ message: 'Role updated successfully' });
  } catch (error) {
    next(error);
  }
};

export { getClubs, createClub, joinClub, leaveClub, postClubMessage, getClubMessages, updateMemberRole };
