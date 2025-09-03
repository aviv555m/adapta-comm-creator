import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAllCategories } from '@/data/boardData';
import { useLanguage } from '@/hooks/useLanguage';

export interface BoardSettings {
  voiceRate?: number;
  voicePitch?: number;
  voiceGender?: 'male' | 'female' | 'neutral';
  tileSize?: number; // 1-10 scale
  gridColsMobile?: number;
  gridColsDesktop?: number;
  highContrast?: boolean;
  showLabels?: boolean;
  showEmoji?: boolean;
  showGazeDot?: boolean;
  enabledCategories?: string[];
  ollamaUrl?: string;
  ollamaModel?: string;
}

export interface ProfileData {
  name: string;
  interests: string;
}

interface BoardSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSettings: BoardSettings;
  initialProfile: ProfileData;
  onSave: (settings: BoardSettings, profile: ProfileData) => void;
}

const BoardSettingsDialog = ({ open, onOpenChange, initialSettings, initialProfile, onSave }: BoardSettingsDialogProps) => {
  const [settings, setSettings] = useState<BoardSettings>(initialSettings);
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const { language, toggleLanguage, t } = useLanguage();
  const allCategories = getAllCategories().filter(cat => cat !== 'Most Used');

  const handleSave = () => {
    onSave(settings, profile);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t('settings')}</DialogTitle>
          <DialogDescription>
            Customize your board appearance and behavior
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] overflow-y-auto pr-4">
          <div className="space-y-6">
            {/* Language Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Language Settings</h3>
              <div className="flex items-center space-x-4">
                <Label>Current Language: {language === 'en' ? 'English' : 'עברית'}</Label>
                <Button 
                  variant="outline" 
                  onClick={toggleLanguage}
                  className="px-4 py-2"
                >
                  Switch to {language === 'en' ? 'עברית' : 'English'}
                </Button>
              </div>
            </div>

            {/* Voice Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Voice Settings</h3>
              <div className="space-y-2">
                <Label>Voice Rate: {settings.voiceRate || 1}</Label>
                <Slider
                  value={[settings.voiceRate || 1]}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, voiceRate: value[0] }))}
                  min={0.5}
                  max={2}
                  step={0.1}
                />
              </div>
              <div className="space-y-2">
                <Label>Voice Pitch: {settings.voicePitch || 1}</Label>
                <Slider
                  value={[settings.voicePitch || 1]}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, voicePitch: value[0] }))}
                  min={0.5}
                  max={2}
                  step={0.1}
                />
              </div>
            </div>

            {/* Layout Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Layout Settings</h3>
              <div className="space-y-2">
                <Label>Tile Size (1-10 scale, 10 = 2.5x larger)</Label>
                <Slider
                  value={[settings.tileSize || 5]}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, tileSize: value[0] }))}
                  min={1}
                  max={10}
                  step={1}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Small (1)</span>
                  <span>Current: {settings.tileSize || 5}</span>
                  <span>Extra Large (10)</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Label>High Contrast</Label>
                  <Switch
                    checked={settings.highContrast || false}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, highContrast: checked }))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label>Show Labels</Label>
                  <Switch
                    checked={settings.showLabels !== false}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showLabels: checked }))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label>Show Emoji</Label>
                  <Switch
                    checked={settings.showEmoji !== false}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showEmoji: checked }))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label>Show Gaze Dot</Label>
                  <Switch
                    checked={settings.showGazeDot !== false}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showGazeDot: checked }))}
                  />
                </div>
              </div>
            </div>

            {/* Categories Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Categories Settings</h3>
              <div className="space-y-2">
                <Label>Enabled Categories (leave empty for all)</Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {allCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Switch
                        checked={!settings.enabledCategories || settings.enabledCategories.includes(category)}
                        onCheckedChange={(checked) => {
                          const current = settings.enabledCategories || allCategories;
                          if (checked) {
                            const updated = [...current.filter(c => c !== category), category];
                            setSettings(prev => ({ ...prev, enabledCategories: updated }));
                          } else {
                            const updated = current.filter(c => c !== category);
                            setSettings(prev => ({ ...prev, enabledCategories: updated.length === 0 ? allCategories : updated }));
                          }
                        }}
                      />
                      <Label className="text-sm">{category}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">AI Settings (Ollama)</h3>
              <div className="space-y-2">
                <Label>Ollama Server URL</Label>
                <Input
                  placeholder="http://localhost:11434"
                  value={settings.ollamaUrl || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, ollamaUrl: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Ollama Model</Label>
                <Input
                  placeholder="llama3.2"
                  value={settings.ollamaModel || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, ollamaModel: e.target.value }))}
                />
              </div>
            </div>

            {/* Profile Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Profile</h3>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Interests</Label>
                <Input
                  value={profile.interests}
                  onChange={(e) => setProfile(prev => ({ ...prev, interests: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BoardSettingsDialog;