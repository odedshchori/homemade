import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are missing. Please check your .env.local file and restart the server.');
  }

  // Basic validation to help debug
  if (!supabaseUrl.startsWith('http')) {
    throw new Error(`Invalid Supabase URL: "${supabaseUrl}". It must start with https://`);
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
