
import { useState, useEffect } from 'react';
import { subscribeToTable, supabase } from '@/integrations/supabase/client';

interface UseRealtimeDataOptions {
  tableName: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: (data: any) => boolean;
  initialQuery?: () => Promise<any[]>;
}

export function useRealtimeData<T = any>({ 
  tableName, 
  event = '*',
  filter,
  initialQuery
}: UseRealtimeDataOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        if (initialQuery) {
          // Use the initialQuery function if provided
          const initialData = await initialQuery();
          setData(initialData as T[]);
        } else {
          // Default query if no initialQuery is provided
          // Use type assertion to handle table name type safely
          const { data: initialData, error } = await supabase
            .from(tableName as any)
            .select('*') as { data: T[] | null, error: any };
          
          if (error) throw error;
          setData(initialData || []);
        }
      } catch (err) {
        console.error(`Error fetching initial data from ${tableName}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();

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

      // Clean up the subscription when the component unmounts
      return () => {
        unsubscribe();
      };
    } catch (err) {
      console.error("Error in useRealtimeData:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
    }
  }, [tableName, event, filter, initialQuery]);

  return { data, loading, error, setData };
}

export default useRealtimeData;
