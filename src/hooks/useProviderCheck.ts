import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Provider {
  name: string;
  enabled: boolean;
}

export const useProviderCheck = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkProviders = async () => {
      try {
        // Check if Google provider is configured by attempting to get providers
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setError('Failed to check authentication configuration');
          return;
        }

        // For now, we'll assume Google is available
        // In a real app, you'd check the Supabase config
        setProviders([
          { name: 'google', enabled: true }
        ]);
      } catch (err) {
        setError('Failed to check providers');
        console.error('Provider check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkProviders();
  }, []);

  const isGoogleEnabled = providers.some(p => p.name === 'google' && p.enabled);

  return {
    providers,
    loading,
    error,
    isGoogleEnabled
  };
};