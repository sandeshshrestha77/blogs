
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get the Supabase URL and key from environment variables with fallbacks
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://afnrcckplletaqljyjyi.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmbnJjY2twbGxldGFxbGp5anlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMDg0MzgsImV4cCI6MjA1NTg4NDQzOH0.9Sqh5vtPe3ovmfqPAnJZZAoAzzGyPyqCpaVtePhtpWE";

const siteUrl = import.meta.env.PROD 
  ? 'https://sandeshshrestha77.com.np'
  : 'http://localhost:8080';

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined
    }
  }
);
