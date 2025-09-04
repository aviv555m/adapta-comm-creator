import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';

interface GoogleProviderModalProps {
  open: boolean;
  onRecheck: () => void;
  loading?: boolean;
}

const GoogleProviderModal = ({ open, onRecheck, loading = false }: GoogleProviderModalProps) => {
  const supabaseUrl = 'https://xqbhaspfyjqzrrzzeakf.supabase.co';
  const redirectUri = `${supabaseUrl}/auth/v1/callback`;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            Google Provider Not Enabled
          </DialogTitle>
          <DialogDescription className="text-left space-y-4">
            <p>
              Google provider is not enabled in your Supabase project. 
              Please follow these steps to enable it:
            </p>
            
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="font-medium">Setup Instructions:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Go to your Supabase Dashboard</li>
                <li>Navigate to Authentication → Providers</li>
                <li>Find Google and click to enable it</li>
                <li>Add the redirect URI below</li>
              </ol>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium mb-2">Redirect URI:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-background p-2 rounded text-xs break-all">
                  {redirectUri}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(redirectUri)}
                >
                  Copy
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.open('https://supabase.com/dashboard/project', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Supabase
              </Button>
              <Button
                onClick={onRecheck}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Re-check
                  </>
                )}
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleProviderModal;