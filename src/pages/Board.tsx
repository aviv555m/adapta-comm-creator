
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Mic, RotateCcw, Volume2 } from 'lucide-react';
import { useQuiz } from '@/hooks/useQuiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import BoardSettingsDialog, { BoardSettings, ProfileData } from '@/components/BoardSettingsDialog';

interface BoardTile {
  id: string;
  text: string;
  emoji?: string;
  category: string;
  priority: number;
}

const Board = () => {
  const navigate = useNavigate();
  const { questions, resetQuiz } = useQuiz();
  const { toast } = useToast();
  const [selectedTile, setSelectedTile] = useState<BoardTile | null>(null);
  const [currentCategory, setCurrentCategory] = useState('Basic Needs');

  // Settings and Profile (persisted)
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<BoardSettings>(() => {
    const s = localStorage.getItem('echoes_board_settings');
    return s ? JSON.parse(s) : { voiceRate: 1, voicePitch: 1, tileSize: 'md' };
  });
  const [profile, setProfile] = useState<ProfileData>(() => {
    const p = localStorage.getItem('echoes_profile');
    return p ? JSON.parse(p) : { name: '', interests: '' };
  });

  // Generate board configuration based on quiz answers
  const generateBoardConfig = () => {
    const orgPreference = questions.find(q => q.id === 31)?.value || 'Mix of both approaches';
    const communicationNeeds = questions.find(q => q.id === 1)?.value;
    const interests = questions.find(q => q.id === 11)?.value;
    
    // Core phrases for top row
    const corePhases: BoardTile[] = [
      { id: 'core1', text: 'I need help', emoji: '🆘', category: 'Core', priority: 1 },
      { id: 'core2', text: 'Please help me', emoji: '🙏', category: 'Core', priority: 1 },
      { id: 'core3', text: 'Thank you', emoji: '🙇', category: 'Core', priority: 1 },
      { id: 'core4', text: 'Yes', emoji: '👍', category: 'Core', priority: 1 },
      { id: 'core5', text: 'No', emoji: '👎', category: 'Core', priority: 1 },
      { id: 'core6', text: 'Please stop', emoji: '✋', category: 'Core', priority: 1 },
    ];

    // Category-based tiles
    const basicNeeds: BoardTile[] = [
      { id: 'basic1', text: 'I am hungry', emoji: '🍽️', category: 'Basic Needs', priority: 2 },
      { id: 'basic2', text: 'I am thirsty', emoji: '🥤', category: 'Basic Needs', priority: 2 },
      { id: 'basic3', text: 'I need the bathroom', emoji: '🚻', category: 'Basic Needs', priority: 2 },
      { id: 'basic4', text: 'I am tired', emoji: '😴', category: 'Basic Needs', priority: 2 },
      { id: 'basic5', text: 'I am hot', emoji: '🔥', category: 'Basic Needs', priority: 2 },
      { id: 'basic6', text: 'I am cold', emoji: '🥶', category: 'Basic Needs', priority: 2 },
    ];

    const feelings: BoardTile[] = [
      { id: 'feel1', text: 'I am happy', emoji: '🙂', category: 'Feelings', priority: 3 },
      { id: 'feel2', text: 'I am sad', emoji: '😢', category: 'Feelings', priority: 3 },
      { id: 'feel3', text: 'I am angry', emoji: '😠', category: 'Feelings', priority: 3 },
      { id: 'feel4', text: 'I am scared', emoji: '😨', category: 'Feelings', priority: 3 },
      { id: 'feel5', text: 'I am excited', emoji: '🤩', category: 'Feelings', priority: 3 },
      { id: 'feel6', text: 'I am confused', emoji: '😕', category: 'Feelings', priority: 3 },
    ];

    const actions: BoardTile[] = [
      { id: 'action1', text: 'I want to go', emoji: '🏃', category: 'Actions', priority: 3 },
      { id: 'action2', text: 'I want to stay', emoji: '🧍', category: 'Actions', priority: 3 },
      { id: 'action3', text: 'I want to play', emoji: '🎮', category: 'Actions', priority: 3 },
      { id: 'action4', text: 'I want to rest', emoji: '🛌', category: 'Actions', priority: 3 },
      { id: 'action5', text: 'I want to eat', emoji: '🍎', category: 'Actions', priority: 3 },
      { id: 'action6', text: 'I want to talk', emoji: '💬', category: 'Actions', priority: 3 },
    ];

    // Determine layout based on organization preference
    let tiles: BoardTile[] = [];
    
    if (orgPreference === 'Most used words first') {
      tiles = [...corePhases, ...basicNeeds, ...feelings, ...actions];
    } else if (orgPreference === 'Organized by clear categories') {
      tiles = [...basicNeeds, ...feelings, ...actions, ...corePhases];
    } else {
      // Mix of both approaches
      tiles = [...corePhases, ...basicNeeds, ...feelings, ...actions];
    }

    return {
      tiles,
      layout: orgPreference,
      categories: ['Core', 'Basic Needs', 'Feelings', 'Actions']
    };
  };

  const boardConfig = generateBoardConfig();
  const categories = boardConfig.categories;
  
  // Filter tiles by current category
  const filteredTiles = currentCategory === 'All' 
    ? boardConfig.tiles 
    : boardConfig.tiles.filter(tile => tile.category === currentCategory);

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
    // Text-to-speech with settings
    speakText(tile.text);
  };

  const handleNewSetup = () => {
    if (confirm('Start a new setup? This will clear all current answers.')) {
      resetQuiz();
      navigate('/quiz');
    }
  };

  const tileHeightClass =
    settings.tileSize === 'sm' ? 'h-16' : settings.tileSize === 'lg' ? 'h-24' : 'h-20';

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
              className="secondary-button bg-secondary text-secondary-foreground hover:bg-secondary/80"
              onClick={() => setSettingsOpen(true)}
              title="Open settings"
            >
              <span className="mr-1">⚙️</span>
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
            <Button
              variant="default"
              className="secondary-button bg-accent text-accent-foreground hover:bg-accent/80"
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
              className="secondary-button"
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
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={currentCategory === category ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setCurrentCategory(category)}
                    >
                      <span className="mr-2">
                        {category === 'Core' ? '⭐' : category === 'Basic Needs' ? '🍽️' : category === 'Feelings' ? '🙂' : '➡️'}
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredTiles.map((tile) => (
                    <Button
                      key={tile.id}
                      variant="outline"
                      className={`p-4 text-center whitespace-normal text-wrap border-2 transition-all ${tileHeightClass} ${
                        selectedTile?.id === tile.id 
                          ? 'border-green-400 bg-green-50' 
                          : 'border-gray-200 hover:border-primary hover:bg-accent'
                      }`}
                      onClick={() => handleTileClick(tile)}
                      title={tile.text}
                    >
                      {tile.emoji && <span className="text-lg mr-2">{tile.emoji}</span>}
                      <span className="text-sm font-medium">{tile.text}</span>
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
      </div>
    </div>
  );
};

export default Board;
