import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';

export const useEventLogger = () => {
  const { user } = useSupabaseAuth();

  const logEvent = async (eventType: string, content?: string) => {
    if (!user) return;

    try {
      const { error } = await (supabase as any)
        .from('events')
        .insert({
          user_id: user.id,
          event_type: eventType,
          content: content || null
        });

      if (error) {
        console.error('Failed to log event:', error);
      }
    } catch (error) {
      console.error('Failed to log event:', error);
    }
  };

  return { logEvent };
};