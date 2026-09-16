import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables in frontend.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Valid for local development and deployments under Vite's base path.
export const getOAuthRedirectUrl = () => {
  const basePath = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
  return new URL(`${basePath}auth/callback`, window.location.origin).toString();
};
