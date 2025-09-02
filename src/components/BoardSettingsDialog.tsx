
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type BoardSettings = {
  voiceRate: number;
  voicePitch: number;
  tileSize: 'sm' | 'md' | 'lg';
  gridColsMobile?: 2 | 3 | 4 | 5;
  gridColsDesktop?: 2 | 3 | 4 | 5;
  highContrast?: boolean;
  showLabels?: boolean;
  showEmoji?: boolean;
  showGazeDot?: boolean;
  enabledCategories?: string[];
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

const defaultSettings: BoardSettings = { 
  voiceRate: 1, 
  voicePitch: 1, 
  tileSize: 'md', 
  gridColsMobile: 2, 
  gridColsDesktop: 3, 
  highContrast: false, 
  showLabels: true, 
  showEmoji: true, 
  showGazeDot: true,
  enabledCategories: ['basic', 'daily life', 'social', 'fun', 'other']
};

const availableCategories = [
  { id: 'basic', name: 'Basic', description: 'Colors, Numbers, Time, Weather' },
  { id: 'daily life', name: 'Daily Life', description: 'Food, Clothing, School, Work, Health' },
  { id: 'social', name: 'Social', description: 'People, Communication, Emotions' },
  { id: 'fun', name: 'Fun', description: 'Music, Games, Sports, Activities' },
  { id: 'other', name: 'Other', description: 'Animals, Nature, Places, Technology' }
];
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
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
              <p className="text-xs text-muted-foreground">Small = more tiles, Large = easier to select</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gridColsMobile">Mobile columns</Label>
                <Select value={settings.gridColsMobile?.toString()} onValueChange={(value) => setSettings(s => ({ ...s, gridColsMobile: parseInt(value) as 2 | 3 | 4 | 5 }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select columns" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 columns</SelectItem>
                    <SelectItem value="3">3 columns</SelectItem>
                    <SelectItem value="4">4 columns</SelectItem>
                    <SelectItem value="5">5 columns</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gridColsDesktop">Desktop columns</Label>
                <Select value={settings.gridColsDesktop?.toString()} onValueChange={(value) => setSettings(s => ({ ...s, gridColsDesktop: parseInt(value) as 2 | 3 | 4 | 5 }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select columns" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 columns</SelectItem>
                    <SelectItem value="3">3 columns</SelectItem>
                    <SelectItem value="4">4 columns</SelectItem>
                    <SelectItem value="5">5 columns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Available Categories</Label>
              <p className="text-sm text-muted-foreground">Enable or disable tile categories</p>
            </div>
            
            <div className="space-y-3">
              {availableCategories.map((category) => (
                <div key={category.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Switch
                    checked={settings.enabledCategories?.includes(category.id) ?? true}
                    onCheckedChange={(checked) => {
                      setSettings(s => {
                        const current = s.enabledCategories ?? [];
                        const updated = checked 
                          ? [...current, category.id]
                          : current.filter(id => id !== category.id);
                        return { ...s, enabledCategories: updated };
                      });
                    }}
                  />
                  <div className="flex-1">
                    <Label className="font-medium">{category.name}</Label>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="display" className="mt-4 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>High contrast mode</Label>
                  <p className="text-xs text-muted-foreground">Better visibility for low vision users</p>
                </div>
                <Switch
                  checked={settings.highContrast ?? false}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, highContrast: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Show tile labels</Label>
                  <p className="text-xs text-muted-foreground">Display text labels on tiles</p>
                </div>
                <Switch
                  checked={settings.showLabels ?? true}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, showLabels: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Show emojis</Label>
                  <p className="text-xs text-muted-foreground">Display emoji icons on tiles</p>
                </div>
                <Switch
                  checked={settings.showEmoji ?? true}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, showEmoji: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Show gaze dot</Label>
                  <p className="text-xs text-muted-foreground">Display eye-tracking cursor</p>
                </div>
                <Switch
                  checked={settings.showGazeDot ?? true}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, showGazeDot: checked }))}
                />
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
