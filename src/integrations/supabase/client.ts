
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to subscribe to real-time changes on a Supabase table
export const subscribeToTable = (
  tableName: string,
  callback: (payload: any) => void,
  event = '*'
) => {
  // Fix the issue with the RealtimeChannelOptions type by using a type assertion
  const channel = supabase.channel(`table-changes-${tableName}`, {
    config: {
      broadcast: { self: true },
    },
  });

  // Use the correct method signature with type assertion to fix TS error
  channel
    .on(
      'postgres_changes',
      {
        event: event,
        schema: 'public',
        table: tableName,
      } as any, // Type assertion to bypass TypeScript error
      (payload) => {
        callback(payload);
      }
    )
    .subscribe((status) => {
      if (status !== 'SUBSCRIBED') {
        console.error(`Failed to subscribe to ${tableName}:`, status);
      }
    });

  return () => {
    supabase.removeChannel(channel);
  };
};

export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signInWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signUpWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signUp({
    email,
    password,
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const resetPassword = async (email: string) => {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
};
