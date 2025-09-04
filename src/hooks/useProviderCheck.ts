import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProviderConfig {
  google?: {
    enabled: boolean;
  };
}

export const useProviderCheck = () => {
  const [googleEnabled, setGoogleEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkProviders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use the correct project values
      const supabaseUrl = 'https://wwseomvevwswwojoowag.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3c2VvbXZldndzd3dvam9vd2FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5ODY3NTAsImV4cCI6MjA3MjU2Mjc1MH0.hPmDrnH1uI_IVvopGFnuavzY4LhjPo2CMaj2i50-KmI';
      
      // Check auth settings
      const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const settings = await response.json();
      console.log('Auth settings:', settings);
      
      // Check if Google provider is enabled
      const googleProviderEnabled = settings?.external?.google?.enabled === true;
      setGoogleEnabled(googleProviderEnabled);
      
    } catch (error) {
      console.error('Error checking providers:', error);
      setError(error instanceof Error ? error.message : 'Failed to check providers');
      // Assume Google is enabled if we can't check (fallback)
      setGoogleEnabled(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkProviders();
  }, []);

  return {
    googleEnabled,
    loading,
    error,
    recheckProviders: checkProviders
  };
};