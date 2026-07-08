import { createClient } from '@supabase/supabase-js';

// Note: dotenv.config() is called once in server.js before this module loads
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Service role client — bypasses RLS. Use for all trusted backend operations.
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Anon client — respects RLS. Use if you ever proxy client-side requests.
export const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
