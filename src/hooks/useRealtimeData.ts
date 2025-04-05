
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useRealtimeData<T>(
  tableName: string,
  initialQuery: () => Promise<{ data: T[] | null; error: any }>,
  options?: { 
    event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
    filter?: string
  }
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: fetchedData, error: fetchError } = await initialQuery();
        
        if (fetchError) {
          throw fetchError;
        }
        
        setData(fetchedData || []);
      } catch (e) {
        console.error(`Error fetching data from ${tableName}:`, e);
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger, tableName]);

  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    const setupSubscription = () => {
      // Create a unique channel name
      const channelName = `realtime-${tableName}-${Date.now()}`;
      
      // Set up the channel with the table subscription
      channel = supabase.channel(channelName)
        .on('postgres_changes', {
          event: options?.event || '*',
          schema: 'public',
          table: tableName,
          filter: options?.filter
        }, () => {
          // When any change happens, just refresh the data
          refreshData();
        })
        .subscribe((status) => {
          if (status !== 'SUBSCRIBED') {
            console.error(`Failed to subscribe to ${tableName}:`, status);
          } else {
            console.log(`Successfully subscribed to ${tableName} changes`);
          }
        });
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [tableName, options?.event, options?.filter]);

  return { data, loading, error, refresh: refreshData };
}
