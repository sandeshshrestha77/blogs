import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://afnrcckplletaqljyjyi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmbnJjY2twbGxldGFxbGp5anlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMDg0MzgsImV4cCI6MjA1NTg4NDQzOH0.9Sqh5vtPe3ovmfqPAnJZZAoAzzGyPyqCpaVtePhtpWE";

// Get the current site URL
const siteUrl = import.meta.env.PROD 
  ? (import.meta.env.VITE_SITE_URL || 'https://blog.sandeshshrestha.xyz')
  : 'http://localhost:8080';

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: window.localStorage,
    },
  }
);
