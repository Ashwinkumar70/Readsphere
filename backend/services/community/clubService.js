import { supabase } from '../../config/supabase.js';

export const clubService = {
  async getClubs() {
    const { data, error } = await supabase
      .from('clubs')
      .select('*, owner:users!owner_id(name, avatar_url)')
      .eq('is_private', false)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getClubDetails(clubId) {
    const { data, error } = await supabase
      .from('clubs')
      .select('*, owner:users!owner_id(name, avatar_url)')
      .eq('id', clubId)
      .single();
    if (error) throw error;
    return data;
  },

  async createClub(userId, clubData) {
    const { data: club, error } = await supabase
      .from('clubs')
      .insert([{ owner_id: userId, ...clubData }])
      .select()
      .single();
    
    if (error) throw error;

    // Add owner as member
    await supabase.from('club_members').insert([{
      club_id: club.id,
      user_id: userId,
      role: 'owner'
    }]);

    return club;
  },

  async getMembers(clubId) {
    const { data, error } = await supabase
      .from('club_members')
      .select('*, user:users!user_id(name, avatar_url)')
      .eq('club_id', clubId);
    if (error) throw error;
    return data;
  },

  async joinClub(clubId, userId) {
    const { data, error } = await supabase
      .from('club_members')
      .insert([{ club_id: clubId, user_id: userId, role: 'member' }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async leaveClub(clubId, userId) {
    const { error } = await supabase
      .from('club_members')
      .delete()
      .match({ club_id: clubId, user_id: userId });
    if (error) throw error;
    return true;
  },

  // --- Chat Methods ---
  async getMessages(clubId, page = 1, limit = 50) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from('club_messages')
      .select('*, user:users!user_id(name, avatar_url, role)')
      .eq('club_id', clubId)
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    return data;
  },

  async postMessage(clubId, userId, content) {
    const { data, error } = await supabase
      .from('club_messages')
      .insert([{ club_id: clubId, user_id: userId, content }])
      .select('*, user:users!user_id(name, avatar_url, role)')
      .single();
    if (error) throw error;
    return data;
  },

  async editMessage(messageId, userId, newContent) {
    // RLS or service-level check ensures only owner edits
    const { data, error } = await supabase
      .from('club_messages')
      .update({ content: newContent, updated_at: new Date().toISOString() })
      .match({ id: messageId, user_id: userId })
      .select('*, user:users!user_id(name, avatar_url, role)')
      .single();
    if (error) throw error;
    return data;
  },

  async deleteMessage(messageId, userId) {
    const { error } = await supabase
      .from('club_messages')
      .delete()
      .match({ id: messageId, user_id: userId });
    if (error) throw error;
    return true;
  },

  async pinMessage(messageId, isPinned) {
    const { data, error } = await supabase
      .from('club_messages')
      .update({ is_pinned: isPinned })
      .eq('id', messageId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
