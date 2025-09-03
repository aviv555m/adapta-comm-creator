import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useProviderCheck } from '@/hooks/useProviderCheck';
import { useEventLogger } from '@/hooks/useEventLogger';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { toast } from '@/hooks/use-toast';
import GoogleProviderModal from '@/components/GoogleProviderModal';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signInWithGoogle, isAuthenticated } = useSupabaseAuth();
  const { googleEnabled, loading: providerLoading, recheckProviders } = useProviderCheck();
  const { logEvent } = useEventLogger();
  const { layout } = useResponsiveLayout();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/onboarding');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleSignIn = async () => {
    // Check if Google provider is enabled before attempting login
    if (googleEnabled === false) {
      toast({
        title: "Google Login Unavailable",
        description: "Google provider is not enabled. Please check configuration.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await signInWithGoogle();
      
      if (error) {
        console.error('Google sign-in error:', error);
        
        // Handle specific provider error
        if (error.message.includes('provider is not enabled')) {
          await recheckProviders();
          toast({
            title: "Provider Not Enabled",
            description: "Google provider is not enabled in Supabase. Please enable it first.",
            variant: "destructive"
          });
        } else {
          setError(error.message);
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive"
          });
        }
        
        await logEvent('login_failed', error.message);
      } else {
        console.log('Google sign-in successful:', data);
        await logEvent('login_success', 'google');
        toast({
          title: "Login Successful",
          description: "Welcome to Echoes Board!"
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unexpected error occurred';
      setError(errorMessage);
      await logEvent('login_failed', errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    handleGoogleSignIn();
  };

  // Show loading state while checking providers
  if (providerLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-4"
      style={{ fontSize: `${layout.fontSize}px` }}
    >
      <div 
        className="w-full max-w-md bg-card rounded-xl shadow-xl border p-8 space-y-6"
        style={{ maxWidth: `${Math.min(400, layout.buttonSize * 3)}px` }}
      >
        {/* Logo */}
        <div className="text-center space-y-4">
          <div 
            className="w-16 h-16 bg-primary rounded-full mx-auto flex items-center justify-center"
            style={{ 
              width: `${layout.buttonSize * 0.4}px`, 
              height: `${layout.buttonSize * 0.4}px` 
            }}
          >
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Echoes Board</h1>
            <p className="text-muted-foreground">Sign in to continue to your communication board</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
            <p className="text-destructive text-sm mb-3">{error}</p>
            <Button 
              variant="outline" 
              onClick={handleRetry}
              disabled={loading}
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Google Sign In Button */}
        <div className="space-y-4">
          <Button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-12 text-lg font-medium"
            style={{ height: `${Math.max(48, layout.buttonSize * 0.4)}px` }}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                Signing in...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </div>
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            By signing in, you agree to our terms of service and privacy policy
          </p>
        </div>

        {/* Info Section */}
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            New to Echoes Board? No worries!<br />
            We'll guide you through a quick setup after you sign in.
          </p>
        </div>
      </div>

      {/* Google Provider Modal */}
      <GoogleProviderModal 
        open={googleEnabled === false}
        onRecheck={recheckProviders}
        loading={providerLoading}
      />
    </div>
  );
};

export default LoginPage;