
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export type BoardSettings = {
  voiceRate: number;
  voicePitch: number;
  tileSize: 'sm' | 'md' | 'lg';
};

export type ProfileData = {
  name: string;
  interests: string;
};

interface BoardSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSettings: BoardSettings;
  initialProfile: ProfileData;
  onSave: (settings: BoardSettings, profile: ProfileData) => void;
}

const defaultSettings: BoardSettings = { voiceRate: 1, voicePitch: 1, tileSize: 'md' };
const defaultProfile: ProfileData = { name: '', interests: '' };

export function BoardSettingsDialog({
  open,
  onOpenChange,
  initialSettings,
  initialProfile,
  onSave,
}: BoardSettingsDialogProps) {
  const [settings, setSettings] = useState<BoardSettings>(initialSettings ?? defaultSettings);
  const [profile, setProfile] = useState<ProfileData>(initialProfile ?? defaultProfile);

  useEffect(() => {
    setSettings(initialSettings ?? defaultSettings);
  }, [initialSettings]);

  useEffect(() => {
    setProfile(initialProfile ?? defaultProfile);
  }, [initialProfile]);

  const handleSave = () => {
    onSave(settings, profile);
    onOpenChange(false);
  };

  const tileBtn = (size: BoardSettings['tileSize'], label: string) => (
    <Button
      key={size}
      type="button"
      variant={settings.tileSize === size ? 'default' : 'outline'}
      className="mr-2 mb-2"
      onClick={() => setSettings((s) => ({ ...s, tileSize: size }))}
    >
      {label}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>AAC Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="board">Board</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Interests</Label>
              <Input
                id="interests"
                placeholder="E.g. music, animals, soccer"
                value={profile.interests}
                onChange={(e) => setProfile((p) => ({ ...p, interests: e.target.value }))}
              />
            </div>
          </TabsContent>

          <TabsContent value="board" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rate">Voice rate</Label>
                <Input
                  id="rate"
                  type="number"
                  step={0.1}
                  min={0.5}
                  max={2}
                  value={settings.voiceRate}
                  onChange={(e) => setSettings((s) => ({ ...s, voiceRate: Number(e.target.value) }))}
                />
                <p className="text-xs text-muted-foreground">0.5–2.0 (default 1.0)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pitch">Voice pitch</Label>
                <Input
                  id="pitch"
                  type="number"
                  step={0.1}
                  min={0.5}
                  max={2}
                  value={settings.voicePitch}
                  onChange={(e) => setSettings((s) => ({ ...s, voicePitch: Number(e.target.value) }))}
                />
                <p className="text-xs text-muted-foreground">0.5–2.0 (default 1.0)</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tile size</Label>
              <div className="flex flex-wrap">
                {tileBtn('sm', 'Small')}
                {tileBtn('md', 'Medium')}
                {tileBtn('lg', 'Large')}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default BoardSettingsDialog;
