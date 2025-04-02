
import { useState, useEffect } from 'react';
import { subscribeToTable } from '@/integrations/supabase/client';

interface UseRealtimeDataOptions {
  tableName: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: (data: any) => boolean;
}

export function useRealtimeData<T = any>({ 
  tableName, 
  event = '*',
  filter 
}: UseRealtimeDataOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Create subscription to the Supabase table
      const unsubscribe = subscribeToTable(
        tableName,
        (payload) => {
          // Process the payload based on the event type
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const newItem = payload.new as T;
            
            // Apply filter if provided
            if (filter && !filter(newItem)) {
              return;
            }
            
            setData((currentData) => {
              // Check if the item already exists
              const exists = currentData.some((item: any) => item.id === (newItem as any).id);
              
              if (exists) {
                // Update existing item
                return currentData.map((item: any) => 
                  item.id === (newItem as any).id ? newItem : item
                );
              } else {
                // Add new item
                return [...currentData, newItem];
              }
            });
          } 
          else if (payload.eventType === 'DELETE') {
            const oldItem = payload.old as T;
            
            setData((currentData) => 
              currentData.filter((item: any) => item.id !== (oldItem as any).id)
            );
          }
        },
        event
      );

      setLoading(false);
      
      // Clean up the subscription when the component unmounts
      return () => {
        unsubscribe();
      };
    } catch (err) {
      console.error("Error in useRealtimeData:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
    }
  }, [tableName, event, filter]);

  return { data, loading, error, setData };
}

export default useRealtimeData;
