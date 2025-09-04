import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EventData {
  event_type: string;
  event_data?: Record<string, any>;
  user_id?: string;
  session_id?: string;
}

export const useEventLogger = () => {
  const logEvent = useCallback(async (eventData: EventData) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      const eventRecord = {
        ...eventData,
        user_id: user?.id || eventData.user_id,
        timestamp: new Date().toISOString(),
        session_id: eventData.session_id || crypto.randomUUID()
      };

      // For now, just log to console since we haven't set up the events table
      console.log('Event logged:', eventRecord);
      
      // TODO: Once events table is created, use:
      // const { error } = await supabase
      //   .from('events')
      //   .insert([eventRecord]);
      
      // if (error) {
      //   console.error('Failed to log event:', error);
      // }
    } catch (error) {
      console.error('Error logging event:', error);
    }
  }, []);

  const logUserAction = useCallback((action: string, details?: Record<string, any>) => {
    logEvent({
      event_type: 'user_action',
      event_data: {
        action,
        ...details
      }
    });
  }, [logEvent]);

  const logSystemEvent = useCallback((event: string, details?: Record<string, any>) => {
    logEvent({
      event_type: 'system_event',
      event_data: {
        event,
        ...details
      }
    });
  }, [logEvent]);

  return {
    logEvent,
    logUserAction,
    logSystemEvent
  };
};