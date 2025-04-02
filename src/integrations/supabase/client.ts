
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
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);

// Helper for subscribing to table changes
export const subscribeToTable = (
  tableName: string,
  callback: (payload: any) => void,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*'
) => {
  const channel = supabase
    .channel(`table-changes:${tableName}`)
    .on(
      'postgres_changes', 
      { 
        event: event, 
        schema: 'public', 
        table: tableName 
      }, 
      callback
    )
    .subscribe();

  return channel;
};

// Helper for removing a channel
export const removeChannel = (channel: any) => {
  supabase.removeChannel(channel);
};
