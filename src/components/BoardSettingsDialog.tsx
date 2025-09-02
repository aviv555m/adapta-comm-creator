
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type BoardSettings = {
  // Voice & Audio
  voiceRate: number;
  voicePitch: number;
  voiceVolume: number;
  voiceGender: 'male' | 'female' | 'child';
  soundFeedback: boolean;
  
  // Layout & Visual
  tileSize: 'sm' | 'md' | 'lg';
  gridColsMobile?: 2 | 3 | 4 | 5;
  gridColsDesktop?: 2 | 3 | 4 | 5 | 6;
  highContrast?: boolean;
  darkMode?: boolean;
  showLabels?: boolean;
  showEmoji?: boolean;
  showIconsOnly?: boolean;
  showTextOnly?: boolean;
  tileBorderThickness: 'thin' | 'medium' | 'thick';
  tileColorGrouping?: boolean;
  
  // Eye Tracking & Access
  showGazeDot?: boolean;
  eyeTrackingEnabled?: boolean;
  fixationTime: number; // in milliseconds
  dwellHighlight?: boolean;
  blinkToSelect?: boolean;
  dualControlMode?: boolean;
  
  // Categories & Content
  enabledCategories?: string[];
  categoryOrder?: string[];
  
  // AI & Smart Features
  predictiveSuggestions?: boolean;
  showHistory?: boolean;
  showFavorites?: boolean;
  contextualBoards?: boolean;
  adaptiveLayout?: boolean;
  
  // Safety & Accessibility
  lockLayout?: boolean;
  safeMode?: boolean;
  parentalMode?: boolean;
  offlineMode?: boolean;
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
  // Voice & Audio
  voiceRate: 1, 
  voicePitch: 1,
  voiceVolume: 0.8,
  voiceGender: 'female',
  soundFeedback: true,
  
  // Layout & Visual
  tileSize: 'md', 
  gridColsMobile: 2, 
  gridColsDesktop: 3, 
  highContrast: false,
  darkMode: false,
  showLabels: true, 
  showEmoji: true,
  showIconsOnly: false,
  showTextOnly: false,
  tileBorderThickness: 'medium',
  tileColorGrouping: false,
  
  // Eye Tracking & Access
  showGazeDot: true,
  eyeTrackingEnabled: false,
  fixationTime: 1000,
  dwellHighlight: true,
  blinkToSelect: false,
  dualControlMode: false,
  
  // Categories & Content
  enabledCategories: ['basic-needs', 'core-words', 'food-drinks', 'emotions', 'actions'],
  categoryOrder: ['basic-needs', 'core-words', 'food-drinks', 'emotions', 'actions'],
  
  // AI & Smart Features
  predictiveSuggestions: false,
  showHistory: true,
  showFavorites: true,
  contextualBoards: false,
  adaptiveLayout: false,
  
  // Safety & Accessibility
  lockLayout: false,
  safeMode: true,
  parentalMode: false,
  offlineMode: true
};

const availableCategories = [
  { id: 'basic-needs', name: 'Basic Needs', description: 'Food, toilet, drink, sleep' },
  { id: 'core-words', name: 'Core Words', description: 'I, want, go, stop, more, help' },
  { id: 'food-drinks', name: 'Food & Drinks', description: 'Meals, snacks, beverages' },
  { id: 'emotions', name: 'Emotions', description: 'Happy, sad, angry, tired' },
  { id: 'actions', name: 'Actions', description: 'Play, eat, sleep, work' },
  { id: 'people', name: 'People', description: 'Family, friends, teachers' },
  { id: 'places', name: 'Places', description: 'Home, school, park, store' },
  { id: 'animals', name: 'Animals', description: 'Pets, farm animals, wild animals' },
  { id: 'basic-info', name: 'Colors, Numbers, Time', description: 'Basic information concepts' },
  { id: 'school-work', name: 'School & Work', description: 'Learning, subjects, office' },
  { id: 'activities', name: 'Music, Games, Sports', description: 'Entertainment and hobbies' },
  { id: 'safety-health', name: 'Safety & Health', description: 'Medical, emergency, wellness' }
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
          <TabsList className="grid w-full grid-cols-6 text-xs">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
            <TabsTrigger value="board">Layout</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="eyetrack">Eye Track</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
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

          <TabsContent value="voice" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rate">Voice rate (speed)</Label>
                <Input
                  id="rate"
                  type="number"
                  step={0.1}
                  min={0.5}
                  max={2}
                  value={settings.voiceRate}
                  onChange={(e) => setSettings((s) => ({ ...s, voiceRate: Number(e.target.value) }))}
                />
                <p className="text-xs text-muted-foreground">0.5 = slow, 1.0 = normal, 2.0 = fast</p>
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
                <p className="text-xs text-muted-foreground">0.5 = low, 1.0 = normal, 2.0 = high</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="volume">Voice volume</Label>
                <Input
                  id="volume"
                  type="number"
                  step={0.1}
                  min={0}
                  max={1}
                  value={settings.voiceVolume}
                  onChange={(e) => setSettings((s) => ({ ...s, voiceVolume: Number(e.target.value) }))}
                />
                <p className="text-xs text-muted-foreground">0.0 = silent, 1.0 = full volume</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Voice gender</Label>
                <Select value={settings.voiceGender} onValueChange={(value) => setSettings(s => ({ ...s, voiceGender: value as 'male' | 'female' | 'child' }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female voice</SelectItem>
                    <SelectItem value="male">Male voice</SelectItem>
                    <SelectItem value="child">Child voice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Sound feedback</Label>
                <p className="text-xs text-muted-foreground">Play click sound when tiles are pressed</p>
              </div>
              <Switch
                checked={settings.soundFeedback ?? true}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, soundFeedback: checked }))}
              />
            </div>
          </TabsContent>

          <TabsContent value="board" className="mt-4 space-y-6">
            <div className="space-y-2">
              <Label>Tile size</Label>
              <div className="flex flex-wrap">
                {tileBtn('sm', 'Small')}
                {tileBtn('md', 'Medium')}
                {tileBtn('lg', 'Large')}
              </div>
              <p className="text-xs text-muted-foreground">Large tiles are easier for eye tracking</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mobile columns</Label>
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
                <Label>Desktop columns</Label>
                <Select value={settings.gridColsDesktop?.toString()} onValueChange={(value) => setSettings(s => ({ ...s, gridColsDesktop: parseInt(value) as 2 | 3 | 4 | 5 | 6 }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select columns" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 columns</SelectItem>
                    <SelectItem value="3">3 columns</SelectItem>
                    <SelectItem value="4">4 columns</SelectItem>
                    <SelectItem value="5">5 columns</SelectItem>
                    <SelectItem value="6">6 columns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

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
                  <Label>Dark mode</Label>
                  <p className="text-xs text-muted-foreground">Dark background theme</p>
                </div>
                <Switch
                  checked={settings.darkMode ?? false}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, darkMode: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Show tile labels</Label>
                  <p className="text-xs text-muted-foreground">Display text on tiles</p>
                </div>
                <Switch
                  checked={settings.showLabels ?? true}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, showLabels: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Show emojis</Label>
                  <p className="text-xs text-muted-foreground">Display emoji icons</p>
                </div>
                <Switch
                  checked={settings.showEmoji ?? true}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, showEmoji: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Icons only mode</Label>
                  <p className="text-xs text-muted-foreground">Hide text labels, show only icons</p>
                </div>
                <Switch
                  checked={settings.showIconsOnly ?? false}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, showIconsOnly: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Text only mode</Label>
                  <p className="text-xs text-muted-foreground">Hide icons, show only text</p>
                </div>
                <Switch
                  checked={settings.showTextOnly ?? false}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, showTextOnly: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Tile border thickness</Label>
                <Select value={settings.tileBorderThickness} onValueChange={(value) => setSettings(s => ({ ...s, tileBorderThickness: value as 'thin' | 'medium' | 'thick' }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thin">Thin borders</SelectItem>
                    <SelectItem value="medium">Medium borders</SelectItem>
                    <SelectItem value="thick">Thick borders</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>AAC Communication Categories</Label>
              <p className="text-sm text-muted-foreground">Enable categories for this user's communication needs</p>
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

          <TabsContent value="eyetrack" className="mt-4 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable eye tracking</Label>
                  <p className="text-xs text-muted-foreground">Use eyes to select tiles</p>
                </div>
                <Switch
                  checked={settings.eyeTrackingEnabled ?? false}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, eyeTrackingEnabled: checked }))}
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

              <div className="space-y-2">
                <Label htmlFor="fixationTime">Fixation time (ms)</Label>
                <Input
                  id="fixationTime"
                  type="number"
                  step={100}
                  min={500}
                  max={3000}
                  value={settings.fixationTime}
                  onChange={(e) => setSettings((s) => ({ ...s, fixationTime: Number(e.target.value) }))}
                />
                <p className="text-xs text-muted-foreground">How long to look before selecting (500-3000ms)</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Dwell highlight</Label>
                  <p className="text-xs text-muted-foreground">Highlight tiles while looking</p>
                </div>
                <Switch
                  checked={settings.dwellHighlight ?? true}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, dwellHighlight: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Blink to select</Label>
                  <p className="text-xs text-muted-foreground">Use blinking as selection method</p>
                </div>
                <Switch
                  checked={settings.blinkToSelect ?? false}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, blinkToSelect: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Dual control mode</Label>
                  <p className="text-xs text-muted-foreground">Allow both eye tracking and clicking</p>
                </div>
                <Switch
                  checked={settings.dualControlMode ?? false}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, dualControlMode: checked }))}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="mt-4 space-y-6">
            <div className="space-y-2">
              <Label>AI & Smart Features</Label>
              <p className="text-sm text-muted-foreground">Advanced features for enhanced communication</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Predictive suggestions</Label>
                  <p className="text-xs text-muted-foreground">Show likely next words</p>
                </div>
                <Switch
                  checked={settings.predictiveSuggestions ?? false}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, predictiveSuggestions: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Show communication history</Label>
                  <p className="text-xs text-muted-foreground">Display recently used phrases</p>
                </div>
                <Switch
                  checked={settings.showHistory ?? true}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, showHistory: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Show favorites</Label>
                  <p className="text-xs text-muted-foreground">Display favorite tiles and phrases</p>
                </div>
                <Switch
                  checked={settings.showFavorites ?? true}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, showFavorites: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Contextual boards</Label>
                  <p className="text-xs text-muted-foreground">Different boards for different situations</p>
                </div>
                <Switch
                  checked={settings.contextualBoards ?? false}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, contextualBoards: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Adaptive layout</Label>
                  <p className="text-xs text-muted-foreground">Automatically adjust based on usage</p>
                </div>
                <Switch
                  checked={settings.adaptiveLayout ?? false}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, adaptiveLayout: checked }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Safety & Accessibility</Label>
              <p className="text-sm text-muted-foreground">Protection and access controls</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Lock board layout</Label>
                  <p className="text-xs text-muted-foreground">Prevent accidental changes</p>
                </div>
                <Switch
                  checked={settings.lockLayout ?? false}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, lockLayout: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Safe mode</Label>
                  <p className="text-xs text-muted-foreground">Prevent deletion of important tiles</p>
                </div>
                <Switch
                  checked={settings.safeMode ?? true}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, safeMode: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Parental controls</Label>
                  <p className="text-xs text-muted-foreground">Require supervision for changes</p>
                </div>
                <Switch
                  checked={settings.parentalMode ?? false}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, parentalMode: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Offline mode</Label>
                  <p className="text-xs text-muted-foreground">Work without internet connection</p>
                </div>
                <Switch
                  checked={settings.offlineMode ?? true}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, offlineMode: checked }))}
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
