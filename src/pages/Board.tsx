
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
import { AIControlPanel } from '@/components/AIControlPanel';
import { useBehaviorAnalytics } from '@/hooks/useBehaviorAnalytics';
import { useLanguage } from '@/hooks/useLanguage';

const Board = () => {
  const navigate = useNavigate();
  const { questions, resetQuiz } = useQuiz();
  const { toast } = useToast();
  const { language, t, toggleLanguage } = useLanguage();
  const [selectedTile, setSelectedTile] = useState<BoardTile | null>(null);
  const [currentCategory, setCurrentCategory] = useState('Most Used');
  const [aiControlPanelOpen, setAiControlPanelOpen] = useState(false);
  
  // Eye tracking
  const { 
    gaze, 
    active, 
    state, 
    start, 
    stop, 
    startCalibration 
  } = useEyeTracking();
  
  // Usage tracking and behavior analytics
  const { usage, trackTileUsage, getMostUsedTiles } = useUsageTracking();
  const { trackInteraction, startSession, endSession } = useBehaviorAnalytics();

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

  const getCategoryDescription = (category: string): string => {
    const descriptions: Record<string, string> = {
      'Communication': 'Express feelings, needs, and basic requests',
      'Basic Needs': 'Essential daily activities and requirements',
      'People': 'Family members, friends, and important people',
      'Actions': 'Things you do and activities you enjoy',
      'Feelings': 'Emotions and how you feel',
      'Food': 'Meals, snacks, and favorite foods',
      'Colors': 'Different colors and descriptions',
      'Numbers': 'Numbers and counting activities',
      'Animals': 'Pet names and animal sounds',
      'Places': 'Locations you go to regularly',
      'Objects': 'Things you use and see around you',
      'Toys': 'Games and fun activities'
    };
    return descriptions[category] || 'Tap to explore this category';
  };

  const getSimpleLabel = (tile: BoardTile): string => {
    // Always get the translated text from the translations system
    // The emoji stays the same regardless of language
    const translatedText = t('boardData', tile.text) || tile.text;
    
    // For simple labels, use the first 1-2 words of the translated text
    return translatedText.split(' ').slice(0, 2).join(' ');
  };

  const getTileDescription = (tile: BoardTile): string => {
    const descriptions: Record<string, string> = {
      'hello': 'Greeting others politely',
      'please': 'Making polite requests',
      'thank you': 'Showing gratitude',
      'yes': 'Agreeing or confirming',
      'no': 'Disagreeing or refusing',
      'help': 'Asking for assistance',
      'more': 'Requesting additional items',
      'stop': 'Asking to pause or end activity',
      'finished': 'Indicating completion',
      'want': 'Expressing desires',
      'need': 'Expressing requirements',
      'like': 'Showing preference'
    };
    return descriptions[tile.text.toLowerCase()] || `Use this to say "${tile.text}"`;
  };

const speakText = (text: string) => {
  if (!('speechSynthesis' in window)) return;
  const langCode = language === 'he' ? 'he-IL' : 'en-US';
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = settings.voiceRate ?? 1;
  utterance.pitch = settings.voicePitch ?? 1;
  utterance.lang = langCode;

  // Try to select a voice matching language and preferred gender
  const voices = speechSynthesis.getVoices();
  const langVoices = voices.filter(v => v.lang && v.lang.startsWith(langCode));
  const gender = settings.voiceGender;
  const maleHints = ['male', 'daniel', 'david', 'george', 'james', 'asaf', 'tomer', 'zohar', 'guy'];
  const femaleHints = ['female', 'samantha', 'victoria', 'sarah', 'hila', 'naomi', 'carmit', 'noa', 'shiri'];
  let selected: SpeechSynthesisVoice | undefined;
  if (gender === 'male') {
    selected = langVoices.find(v => maleHints.some(h => v.name.toLowerCase().includes(h)));
  } else if (gender === 'female') {
    selected = langVoices.find(v => femaleHints.some(h => v.name.toLowerCase().includes(h)));
  }
  if (!selected && langVoices.length) {
    selected = langVoices[0];
  }
  if (selected) utterance.voice = selected;

  speechSynthesis.speak(utterance);
};

  const handleTileClick = (tile: BoardTile) => {
    setSelectedTile(tile);
    trackTileUsage(tile.id);
    
    // Track interaction for AI analysis
    trackInteraction({
      type: 'tile_click',
      data: { 
        tileId: tile.id, 
        category: tile.category,
        success: true 
      }
    });
    
    const translatedText = t('boardData', tile.text) || tile.text;
    speakText(translatedText);
    toast({ title: translatedText, description: t('speakingNow'), duration: 1500 });
  };

  const handleEyeTrackingToggle = async () => {
    if (active) {
      stop();
      toast({ title: t('eyeTrackingStopped'), description: t('eyeTrackingStopped') });
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

  // Start session tracking when component mounts
  React.useEffect(() => {
    startSession();
    return () => endSession();
  }, [startSession, endSession]);

  return (
    <div className="app-container">
      <div className="app-card max-w-6xl">
        {/* Welcome Message */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-lg text-blue-800 text-center">
            🌟 {t('welcomeMessage')}
          </p>
        </div>
        
        {/* Header */}
        <div className={`flex justify-between items-center mb-6 ${language === 'he' ? 'flex-row-reverse' : ''}`}>
          <div className={language === 'he' ? 'text-right' : ''}>
            <h1 className="text-2xl font-bold text-foreground">{language === 'he' ? t('echoesBoard2') : t('echoesBoard')}</h1>
            <p className="text-muted-foreground">{t('layout')}: {boardConfig.layout}</p>
          </div>
          <div className={`flex space-x-2 ${language === 'he' ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <Button
              variant="outline"
              onClick={toggleLanguage}
              className="secondary-button"
              title="Toggle Language"
            >
              <Languages className="h-4 w-4 mr-1" />
              {language === 'en' ? 'עברית' : 'English'}
            </Button>
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
              onClick={() => setAiControlPanelOpen(true)}
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
                    title: t('noTileSelected'),
                    description: t('tapTileFirst'),
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

        {/* Full Screen Board Area */}
        <div className="w-full min-h-[80vh]">
          {currentCategory === 'All' ? (
            // Show Categories as full screen main tiles without descriptions
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
              {availableCategories.map((category) => {
                const categoryName = t('categoryNames', category);
                return (
                  <Button
                    key={category}
                    variant="outline"
                    className="p-8 text-center whitespace-normal text-wrap border-2 transition-all flex flex-col items-center justify-center border-border hover:border-primary hover:bg-accent/20 min-h-[300px]"
                    onClick={() => {
                      setCurrentCategory(category);
                      speakText(categoryName);
                      toast({ title: categoryName, description: t('speakingNow'), duration: 1500 });
                    }}
                    title={categoryName}
                  >
                    <span className="text-9xl mb-4 leading-none">
                      {getCategoryEmoji(category)}
                    </span>
                    <span className="text-lg font-bold leading-tight text-center break-words px-2">
                      {categoryName}
                    </span>
                  </Button>
                );
              })}
            </div>
          ) : (
            // Show Back to Categories button first, then 9 Tiles for selected category
            <div className="flex flex-col items-center gap-6 p-6 min-h-[80vh]">
              {/* Back to Categories Button in the middle */}
              <Button
                variant="default"
                className="h-24 w-80 bg-blue-600 text-white hover:bg-blue-700 px-4 py-3 shadow-lg"
                onClick={() => {
                  setCurrentCategory('All');
                  speakText(t('backToCategories'));
                  toast({ title: t('backToCategories'), description: t('returningToCategories'), duration: 1500 });
                }}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-4xl">📋</span>
                  <span className="text-xl font-bold">
                    {language === 'he' ? '→ חזור לקטגוריות' : 'Back to Categories ←'}
                  </span>
                </div>
              </Button>

              {/* 9 Tiles for selected category in 3x3 grid */}
              <div className="grid grid-cols-3 gap-6 w-full max-w-6xl">
                {filteredTiles.map((tile) => {
                  const translatedText = t('boardData', tile.text) || tile.text;
                  const tileDescription = getTileDescription(tile);
                  const simpleLabel = getSimpleLabel(tile);
                  
                  // Get usage count for this tile
                  const usageCount = usage[tile.id]?.count || 0;
                  
                  // Calculate dynamic styling based on usage frequency
                  const getUsageBasedStyling = () => {
                    if (usageCount >= 30) {
                      // Super frequently used - massive and brightest
                      return {
                        size: 'min-h-[320px] scale-125',
                        glow: 'shadow-xl shadow-primary/70 border-primary border-4',
                        brightness: 'bg-primary/30 hover:bg-primary/40',
                        emoji: 'text-[12rem]',
                        text: 'text-4xl'
                      };
                    } else if (usageCount >= 20) {
                      // Extra frequently used - very big and bright
                      return {
                        size: 'min-h-[300px] scale-120',
                        glow: 'shadow-xl shadow-primary/60 border-primary border-3',
                        brightness: 'bg-primary/25 hover:bg-primary/35',
                        emoji: 'text-[10rem]',
                        text: 'text-4xl'
                      };
                    } else if (usageCount >= 10) {
                      // Very frequently used - biggest and brightest
                      return {
                        size: 'min-h-[280px] scale-115',
                        glow: 'shadow-lg shadow-primary/50 border-primary',
                        brightness: 'bg-primary/20 hover:bg-primary/30',
                        emoji: 'text-[8rem]',
                        text: 'text-3xl'
                      };
                    } else if (usageCount >= 5) {
                      // Frequently used - medium enhancement
                      return {
                        size: 'min-h-[240px] scale-105',
                        glow: 'shadow-md shadow-primary/30 border-primary/70',
                        brightness: 'bg-primary/10 hover:bg-primary/20',
                        emoji: 'text-9xl',
                        text: 'text-2xl'
                      };
                    } else if (usageCount >= 2) {
                      // Moderately used - slight enhancement
                      return {
                        size: 'min-h-[220px]',
                        glow: 'shadow-sm shadow-primary/20 border-primary/40',
                        brightness: 'bg-primary/5 hover:bg-primary/10',
                        emoji: 'text-8xl',
                        text: 'text-2xl'
                      };
                    } else {
                      // Default styling for new/rarely used tiles
                      return {
                        size: 'min-h-[200px]',
                        glow: '',
                        brightness: '',
                        emoji: 'text-8xl',
                        text: 'text-2xl'
                      };
                    }
                  };
                  
                  const styling = getUsageBasedStyling();
                  
                  return (
                    <Button
                      key={tile.id}
                      variant="outline"
                      className={`p-8 text-center whitespace-normal text-wrap border-2 transition-all duration-300 flex flex-col items-center justify-center ${styling.size} ${styling.glow} ${styling.brightness} ${
                        selectedTile?.id === tile.id 
                          ? (settings.highContrast ? 'border-primary bg-primary/10' : 'border-primary/60 bg-accent/30')
                          : (settings.highContrast ? 'border-foreground hover:bg-accent' : `border-border hover:border-primary hover:bg-accent/20 ${styling.brightness ? '' : 'hover:bg-accent/20'}`)
                      }`}
                      onClick={() => handleTileClick(tile)}
                      title={`${simpleLabel} - ${tileDescription} (Used ${usageCount} times)`}
                      aria-label={simpleLabel}
                    >
                      {settings.showEmoji !== false && tile.emoji && (
                        <span className={`${styling.emoji} mb-4 leading-none transition-all duration-300 overflow-hidden flex-shrink-0`}>{tile.emoji}</span>
                      )}
                      {settings.showLabels !== false && (
                        <>
                          <span className={`${styling.text} font-bold leading-tight text-center mb-2 text-primary transition-all duration-300`}>
                            {simpleLabel}
                          </span>
                          <span className="text-xs text-muted-foreground leading-tight text-center px-2">
                            {tileDescription}
                          </span>
                          {usageCount > 0 && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full mt-2">
                              {usageCount} clicks
                            </span>
                          )}
                        </>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
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
                title: t('eyeTrackingReady'), 
                description: t('calibrationCompleted')
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
          onTrackInteraction={(type, data) => {
            trackInteraction({ type: type as any, data });
          }}
          usageData={{
            clickCounts: usage,
            mostUsedTiles: getMostUsedTiles(boardConfig.tiles, 10),
            totalInteractions: Object.values(usage).reduce((sum, tileUsage) => sum + tileUsage.count, 0),
            categoriesUsed: [...new Set(Object.keys(usage).map(tileId => 
              boardConfig.tiles.find(t => t.id === tileId)?.category).filter(Boolean))]
          }}
        />

        {/* AI Control Panel */}
        <AIControlPanel
          isOpen={aiControlPanelOpen}
          onClose={() => setAiControlPanelOpen(false)}
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
