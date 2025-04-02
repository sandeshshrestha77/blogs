
import { useState, useEffect } from 'react';
import { supabase, subscribeToTable, removeChannel } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type UseRealtimeDataOptions = {
  tableName: string;
  initialQuery?: () => Promise<any>;
  events?: Array<'INSERT' | 'UPDATE' | 'DELETE'>;
};

export const useRealtimeData = <T extends any[]>({
  tableName,
  initialQuery,
  events = ['INSERT', 'UPDATE', 'DELETE']
}: UseRealtimeDataOptions) => {
  const [data, setData] = useState<T | []>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!initialQuery) return;
    
    try {
      setLoading(true);
      const result = await initialQuery();
      
      if (result.error) {
        throw result.error;
      }
      
      setData(result.data || []);
    } catch (err: any) {
      console.error(`Error fetching ${tableName} data:`, err);
      setError(err);
      toast.error(`Error loading data: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const channels = events.map(event => {
      return subscribeToTable(tableName, payload => {
        // Update data based on the event type
        if (event === 'INSERT' && data) {
          setData(prevData => [...(prevData || []), payload.new] as T);
          toast.success('New item added');
        } else if (event === 'UPDATE' && data) {
          setData(prevData => 
            prevData?.map(item => 
              item.id === payload.new.id ? payload.new : item
            ) as T
          );
          toast.info('Item updated');
        } else if (event === 'DELETE' && data) {
          setData(prevData => 
            prevData?.filter(item => item.id !== payload.old.id) as T
          );
          toast.info('Item removed');
        } else {
          // If we can't handle the update precisely, just refetch all data
          fetchData();
        }
      }, event);
    });

    return () => {
      channels.forEach(channel => removeChannel(channel));
    };
  }, [tableName]);

  return { data, loading, error, refetch: fetchData };
};
