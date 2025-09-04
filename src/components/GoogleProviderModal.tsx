import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertCircle } from 'lucide-react';

interface GoogleProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleProviderModal: React.FC<GoogleProviderModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const handleOpenDashboard = () => {
    window.open('https://supabase.com/dashboard/project/hznxxhldinmndagwnrpp/auth/providers', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Google Sign-In Setup Required
          </DialogTitle>
          <DialogDescription className="space-y-3">
            <p>
              To enable Google sign-in, you need to configure the Google OAuth provider 
              in your Supabase dashboard.
            </p>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm font-medium mb-2">Quick setup steps:</p>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Click the button below to open your Supabase dashboard</li>
                <li>Enable the Google provider</li>
                <li>Add your Google OAuth credentials</li>
                <li>Set your redirect URLs</li>
              </ol>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Button onClick={handleOpenDashboard} className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Open Supabase Dashboard
          </Button>
          <Button variant="outline" onClick={onClose}>
            Continue Without Google Sign-In
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};