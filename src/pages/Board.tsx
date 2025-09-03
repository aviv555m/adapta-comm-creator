
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Mic, RotateCcw, Volume2, Eye, EyeOff, Languages } from 'lucide-react';
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
import { useLanguage } from '@/hooks/useLanguage';

const Board = () => {
  const navigate = useNavigate();
  const { questions, resetQuiz } = useQuiz();
  const { toast } = useToast();
  const { language, t } = useLanguage();
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
  return { voiceRate: 1, voicePitch: 1, tileSize: 5, gridColsMobile: 2, gridColsDesktop: 3, highContrast: false, showLabels: true, showEmoji: true, showGazeDot: true, ollamaUrl: 'http://localhost:11434', ollamaModel: 'llama3.2', ...parsed } as BoardSettings;
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
      return getMostUsedTiles(tiles, 9); // Changed to 9 for consistency
    } else {
      // Get exactly 9 tiles from the selected category
      const categoryTiles = tiles.filter(tile => tile.category === currentCategory);
      return categoryTiles.slice(0, 9);
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
    utterance.lang = language === 'he' ? 'he-IL' : 'en-US';
    speechSynthesis.speak(utterance);
  };

const handleTileClick = (tile: BoardTile) => {
  setSelectedTile(tile);
  trackTileUsage(tile.id);
  const translatedText = t('boardData', tile.text) || tile.text;
  speakText(translatedText);
  toast({ title: translatedText, description: 'Speaking now', duration: 1500 });
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

// Calculate tile size based on 1-10 scale where 10 = 2.5x larger than base
const baseTileHeight = 180; // very big buttons
const tileSizeValue = typeof settings.tileSize === 'number' ? settings.tileSize : 5;
const scaleFactor = 1 + ((tileSizeValue - 5) * 0.3); // Scale from 0.4 to 2.5
const calculatedHeight = Math.round(baseTileHeight * scaleFactor);
const tileHeightStyle = { height: `${calculatedHeight}px` };

// Force 3 columns layout for very big buttons
const gridMobileClass = 'grid-cols-3';
const gridDesktopClass = 'grid-cols-3';

  return (
    <div className="app-container">
      <div className="app-card max-w-6xl">
        {/* Welcome Message */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-lg text-blue-800 text-center">
            🌟 Welcome! Please answer the questions to set up your communication board
          </p>
        </div>
        
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
              {t('settings')}
            </Button>
            <Button
              variant="default"
              className="bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => {
                if (settings.ollamaUrl && settings.ollamaModel) {
                  toast({
                    title: t('aiAdapt'),
                    description: '🤖 AI is ready! Use the chat in the bottom right to customize your board.',
                  });
                } else {
                  toast({
                    title: 'AI Not Connected',
                    description: 'Please configure Ollama in settings first.',
                  });
                }
              }}
            >
              <span className="mr-1">🤖</span>
              <Volume2 className="h-4 w-4 mr-1" />
              {t('aiAdapt')}
            </Button>
            <Button
              variant="default"
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={() => {
                if (selectedTile) {
                  const translatedText = t('boardData', selectedTile.text) || selectedTile.text;
                  speakText(translatedText);
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
              {t('ready')}
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
              {state.isCalibrating ? t('calibrating') : active ? t('eyeOff') : t('eyeTrack')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - User Info Only */}
          <div className="lg:col-span-1">
            {/* User Info Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('profile')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.name ? (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('name')}</p>
                    <p className="text-sm">{profile.name}</p>
                  </div>
                ) : null}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('communicationStyle')}</p>
                  <p className="text-sm">{getCommunicationStyle()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('interests')}</p>
                  <p className="text-sm">{getUserInterests()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Back to Categories Button when viewing tiles */}
            {currentCategory !== 'All' && (
              <Card className="mt-4">
                <CardContent className="p-4">
                  <Button
                    variant="default"
                    className="w-full h-20 bg-blue-600 text-white hover:bg-blue-700 px-2 py-3"
                    onClick={() => {
                      setCurrentCategory('All');
                      speakText(t('categories'));
                      toast({ title: t('categories'), description: 'Going back to categories', duration: 1500 });
                    }}
                  >
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className="text-2xl">📋</span>
                      <span className="text-xs font-bold leading-tight text-center break-words">
                        ← {t('categories')}
                      </span>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Board Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {currentCategory === 'All' ? t('categories') : t('categoryNames', currentCategory)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentCategory === 'All' ? (
                  // Show Categories as main tiles
                  <div className="grid grid-cols-3 md:grid-cols-3 gap-3">
                    {availableCategories.map((category) => {
                      const categoryName = t('categoryNames', category);
                      return (
                        <Button
                          key={category}
                          variant="outline"
                          className="p-6 text-center whitespace-normal text-wrap border-2 transition-all flex flex-col items-center justify-center border-border hover:border-primary hover:bg-accent/20"
                          style={tileHeightStyle}
                          onClick={() => {
                            setCurrentCategory(category);
                            speakText(categoryName);
                            toast({ title: categoryName, description: 'Speaking now', duration: 1500 });
                          }}
                          title={categoryName}
                        >
                          <span className="text-8xl mb-2 leading-none">
                            {getCategoryEmoji(category)}
                          </span>
                          <span className="text-xs font-medium leading-tight opacity-80 text-center break-words px-1">
                            {categoryName}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                ) : (
                  // Show exactly 9 Tiles for selected category in 3x3 grid
                  <div className="grid grid-cols-3 gap-3">
                    {filteredTiles.map((tile) => {
                      const translatedText = t('boardData', tile.text) || tile.text;
                      return (
                        <Button
                          key={tile.id}
                          variant="outline"
                          className={`p-6 text-center whitespace-normal text-wrap border-2 transition-all flex flex-col items-center justify-center ${
                            selectedTile?.id === tile.id 
                              ? (settings.highContrast ? 'border-primary bg-primary/10' : 'border-primary/60 bg-accent/30')
                              : (settings.highContrast ? 'border-foreground hover:bg-accent' : 'border-border hover:border-primary hover:bg-accent/20')
                          }`}
                          style={tileHeightStyle}
                          onClick={() => handleTileClick(tile)}
                          title={translatedText}
                        >
                          {settings.showEmoji !== false && tile.emoji && (
                            <span className="text-8xl mb-2 leading-none">{tile.emoji}</span>
                          )}
                          {settings.showLabels !== false && (
                            <span className="text-[10px] font-medium leading-tight opacity-80">{translatedText}</span>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
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
            {t('newSetup')}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            {t('generatedFromQuiz')} • {boardConfig.tiles.length} {t('tilesAvailable')}
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
