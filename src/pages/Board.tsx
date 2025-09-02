
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Mic, RotateCcw, Volume2, Eye, EyeOff } from 'lucide-react';
import { useQuiz } from '@/hooks/useQuiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import BoardSettingsDialog, { BoardSettings, ProfileData } from '@/components/BoardSettingsDialog';
import { useEyeTracking } from '@/hooks/useEyeTracking';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { EyeTrackingDot } from '@/components/EyeTrackingDot';
import CalibrationOverlay from '@/components/CalibrationOverlay';
import { generateExpandedBoardData, getAllCategories, getCategoryEmoji } from '@/data/boardData';
import { BoardTile } from '@/types/board';
import { AIChatBot } from '@/components/AIChatBot';

const Board = () => {
  const navigate = useNavigate();
  const { questions, resetQuiz } = useQuiz();
  const { toast } = useToast();
  const [selectedTile, setSelectedTile] = useState<BoardTile | null>(null);
  const [currentCategory, setCurrentCategory] = useState('Most Used');
  
  // Eye tracking
  const { 
    gaze, 
    active, 
    state, 
    start, 
    stop, 
    startCalibration 
  } = useEyeTracking();
  
  // Usage tracking
  const { trackTileUsage, getMostUsedTiles } = useUsageTracking();

  // Settings and Profile (persisted)
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [calibrationOpen, setCalibrationOpen] = useState(false);
const [settings, setSettings] = useState<BoardSettings>(() => {
  const s = localStorage.getItem('echoes_board_settings');
  const parsed = s ? JSON.parse(s) : {};
  return { voiceRate: 1, voicePitch: 1, tileSize: 'md', gridColsMobile: 2, gridColsDesktop: 3, highContrast: false, showLabels: true, showEmoji: true, showGazeDot: true, ...parsed } as BoardSettings;
});
  const [profile, setProfile] = useState<ProfileData>(() => {
    const p = localStorage.getItem('echoes_profile');
    return p ? JSON.parse(p) : { name: '', interests: '' };
  });

  // Generate board configuration based on quiz answers
  const generateBoardConfig = () => {
    const allTiles = generateExpandedBoardData();
    const allCategories = getAllCategories();
    
    return {
      tiles: allTiles,
      layout: 'Comprehensive AAC Board',
      categories: allCategories
    };
  };

  const boardConfig = generateBoardConfig();
  const categories = boardConfig.categories;
  
  // Filter tiles by current category and enabled categories from settings
  const filteredTiles = (() => {
    let tiles = boardConfig.tiles;
    
    // First, filter by enabled categories if specified in settings
    if (settings.enabledCategories && settings.enabledCategories.length > 0) {
      tiles = tiles.filter(tile => settings.enabledCategories!.includes(tile.category));
    }
    
    // Then filter by current category selection
    if (currentCategory === 'All') {
      return tiles;
    } else if (currentCategory === 'Most Used') {
      return getMostUsedTiles(tiles, 12);
    } else {
      return tiles.filter(tile => tile.category === currentCategory);
    }
  })();

  // Filter available categories based on enabled categories from settings
  const availableCategories = settings.enabledCategories && settings.enabledCategories.length > 0
    ? categories.filter(cat => settings.enabledCategories!.includes(cat))
    : categories;

  // Get user preferences for display
  const getCommunicationStyle = () => {
    const needs = questions.find(q => q.id === 1)?.value;
    const experience = questions.find(q => q.id === 3)?.value;
    return `${experience || 'Not specified'} user focusing on ${needs || 'general communication'}`;
  };

  const getUserInterests = () => {
    const fromProfile = profile.interests?.trim();
    return fromProfile || questions.find(q => q.id === 11)?.value || 'Not specified';
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.voiceRate ?? 1;
    utterance.pitch = settings.voicePitch ?? 1;
    speechSynthesis.speak(utterance);
  };

  const handleTileClick = (tile: BoardTile) => {
    setSelectedTile(tile);
    trackTileUsage(tile.id);
    speakText(tile.text);
  };

  const handleEyeTrackingToggle = async () => {
    if (active) {
      stop();
      toast({ title: '👁️ Eye tracking stopped', description: 'Eye tracking has been disabled.' });
    } else {
      // Open calibration overlay instead of direct calibration
      setCalibrationOpen(true);
    }
  };

  const handleNewSetup = () => {
    if (confirm('Start a new setup? This will clear all current answers.')) {
      resetQuiz();
      navigate('/quiz');
    }
  };

const tileHeightClass =
  settings.tileSize === 'sm' ? 'h-16' : settings.tileSize === 'lg' ? 'h-24' : 'h-20';

// Grid columns from settings (safelisted)
const gridMobileClass = (settings.gridColsMobile || 2) === 2 ? 'grid-cols-2' : (settings.gridColsMobile || 2) === 3 ? 'grid-cols-3' : (settings.gridColsMobile || 2) === 4 ? 'grid-cols-4' : 'grid-cols-5';
const gridDesktopClass = (settings.gridColsDesktop || 3) === 2 ? 'grid-cols-2' : (settings.gridColsDesktop || 3) === 3 ? 'grid-cols-3' : (settings.gridColsDesktop || 3) === 4 ? 'grid-cols-4' : 'grid-cols-5';

  return (
    <div className="app-container">
      <div className="app-card max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Echoes Board</h1>
            <p className="text-muted-foreground">Layout: {boardConfig.layout}</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="default"
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setSettingsOpen(true)}
              title="Open settings"
            >
              <span className="mr-1">⚙️</span>
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
            <Button
              variant="default"
              className="bg-purple-600 text-white hover:bg-purple-700"
              onClick={() =>
                toast({
                  title: 'AI Adapt',
                  description: '🤖 Coming soon: auto-tune your board based on usage.',
                })
              }
            >
              <span className="mr-1">🤖</span>
              <Volume2 className="h-4 w-4 mr-1" />
              AI Adapt
            </Button>
            <Button
              variant="default"
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={() => {
                if (selectedTile) {
                  speakText(selectedTile.text);
                } else {
                  toast({
                    title: 'No tile selected',
                    description: 'Tap a tile first, then press Ready.',
                  });
                }
              }}
            >
              <span className="mr-1">▶️</span>
              <Mic className="h-4 w-4 mr-1" />
              Ready
            </Button>
            <Button
              variant="default"
              className={`${
                active 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              } ${state.isCalibrating ? 'animate-pulse' : ''}`}
              onClick={handleEyeTrackingToggle}
              disabled={state.isCalibrating}
              title={active ? 'Stop eye tracking' : 'Start eye tracking'}
            >
              <span className="mr-1">👁️</span>
              {active ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
              {state.isCalibrating ? 'Calibrating...' : active ? 'Eye Off' : 'Eye Track'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={currentCategory === 'All' ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setCurrentCategory('All')}
                  >
                    <span className="mr-2">🌐</span> All
                   </Button>
                   {/* Filter available categories based on enabled categories from settings */}
                   {availableCategories.map((category) => (
                     <Button
                       key={category}
                       variant={currentCategory === category ? 'default' : 'outline'}
                       className="w-full justify-start text-left"
                       onClick={() => setCurrentCategory(category)}
                     >
                       <span className="mr-2">
                         {getCategoryEmoji(category)}
                       </span>
                       {category}
                     </Button>
                   ))}
                </div>
              </CardContent>
            </Card>

            {/* User Info Panel */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.name ? (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="text-sm">{profile.name}</p>
                  </div>
                ) : null}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Communication Style</p>
                  <p className="text-sm">{getCommunicationStyle()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Interests</p>
                  <p className="text-sm">{getUserInterests()}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Board Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {currentCategory === 'All' ? 'All Categories' : currentCategory}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`grid ${gridMobileClass} md:${gridDesktopClass} gap-3`}>
                  {filteredTiles.map((tile) => (
                    <Button
                      key={tile.id}
                      variant="outline"
                      className={`p-4 text-center whitespace-normal text-wrap border-2 transition-all ${tileHeightClass} ${
                        selectedTile?.id === tile.id 
                          ? (settings.highContrast ? 'border-primary bg-primary/10' : 'border-green-400 bg-green-50')
                          : (settings.highContrast ? 'border-foreground hover:bg-accent' : 'border-gray-200 hover:border-primary hover:bg-accent')
                      }`}
                      onClick={() => handleTileClick(tile)}
                      title={tile.text}
                    >
                      {settings.showEmoji !== false && tile.emoji && (
                        <span className="text-lg mr-2">{tile.emoji}</span>
                      )}
                      {settings.showLabels !== false && (
                        <span className="text-sm font-medium">{tile.text}</span>
                      )}
                    </Button>
                  ))}
                </div>

                {filteredTiles.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No tiles in this category
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Selected Tile Display */}
            {selectedTile && (
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-lg font-medium mb-2">Currently Selected:</p>
                    <p className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
                      {selectedTile.emoji && <span>{selectedTile.emoji}</span>}
                      <span>{selectedTile.text}</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Category: {selectedTile.category}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handleNewSetup}
            className="secondary-button"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            <span className="mr-1">🔄</span>
            New Setup
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Generated from your quiz responses • {boardConfig.tiles.length} tiles available
          </div>
        </div>

        {/* Settings Dialog */}
        <BoardSettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          initialSettings={settings}
          initialProfile={profile}
          onSave={(s, p) => {
            setSettings(s);
            setProfile(p);
            localStorage.setItem('echoes_board_settings', JSON.stringify(s));
            localStorage.setItem('echoes_profile', JSON.stringify(p));
            toast({ title: 'Settings saved', description: 'Your preferences have been updated.' });
          }}
        />

        {/* Eye Tracking Dot */}
        <EyeTrackingDot 
          x={gaze?.x || 0} 
          y={gaze?.y || 0} 
          isVisible={(settings.showGazeDot ?? true) && active && !!gaze} 
        />

        {/* Calibration Overlay */}
        <CalibrationOverlay
          open={calibrationOpen}
          onClose={() => {
            setCalibrationOpen(false);
            if (state.isCalibrated) {
              toast({ 
                title: '👁️ Eye tracking ready!', 
                description: 'Calibration completed successfully. The red dot shows where you\'re looking.' 
              });
            }
          }}
        />

        {/* AI Chat Bot */}
        <AIChatBot
          currentSettings={settings}
          onUpdateSettings={(newSettings) => {
            const updatedSettings = { ...settings, ...newSettings };
            setSettings(updatedSettings);
            localStorage.setItem('echoes_board_settings', JSON.stringify(updatedSettings));
          }}
        />
      </div>
    </div>
  );
};

export default Board;
