import { supabase } from '../config/supabase.js';

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('[AUTH TRACE] Backend - Received Header:', authHeader ? authHeader.substring(0, 25) + '...' : 'NONE');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];
  console.log('[AUTH TRACE] Backend - Extracted Token:', token.substring(0, 15) + '...');

  try {
    // Cryptographically verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    console.log('[AUTH TRACE] Backend - JWT Validation Result:', error ? `FAILED (${error.message})` : 'SUCCESS');
    console.log('[AUTH TRACE] Backend - getUser() Result ID:', user ? user.id : 'NONE');

    if (error || !user) {
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }

    // Fetch full profile with role and status
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('id, name, role, avatar_url, bio, is_active')
      .eq('id', user.id)
      .maybeSingle();
    
    console.log('[AUTH TRACE] Backend - Profile Query Error:', profileError ? profileError.message : 'NONE');
    console.log('[AUTH TRACE] Backend - Profile Data Found:', !!userProfile);

    let finalProfile = userProfile;

    // Self-Healing Mechanism: If the user is authenticated in Supabase but missing from public.users
    // (e.g. because the schema was recreated or trigger failed), automatically rebuild their profile.
    if (profileError || !userProfile) {
      const { error: insertError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          name: user.user_metadata?.name || user.user_metadata?.full_name || (user.email ? user.email.split('@')[0] : 'Unknown'),
          username: user.user_metadata?.username || (user.email ? user.email.split('@')[0] + Math.floor(Math.random() * 10000).toString() : 'user' + Math.floor(Math.random() * 10000).toString()),
          avatar_url: user.user_metadata?.avatar_url,
          role: 'Reader' // Default role
        }, { onConflict: 'id' });

      if (insertError) {
        console.error('[AUTH TRACE] Backend - Upsert Error:', insertError);
        return res.status(401).json({ message: 'User profile not found and could not be recovered' });
      }

      // Immediately fetch the profile again
      const { data: newProfile, error: fetchError } = await supabase
        .from('users')
        .select('id, name, role, avatar_url, bio, is_active')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError || !newProfile) {
        console.error('[AUTH TRACE] Backend - Fetch Error post-upsert:', fetchError, 'Profile:', newProfile);
        return res.status(401).json({ message: 'User profile not found and could not be recovered' });
      }
      finalProfile = newProfile;
    }

    // Reject deactivated/banned users on every request
    if (!finalProfile.is_active) {
      return res.status(403).json({ message: 'Account has been deactivated' });
    }

    req.user = {
      ...finalProfile,
      email: user.email // Attach email from Auth layer
    };
    console.log('[AUTH TRACE] Backend - Profile Successfully Attached:', req.user.id);
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export { protect };
