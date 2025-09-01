import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Mic, RotateCcw, Volume2 } from 'lucide-react';
import { useQuiz } from '@/hooks/useQuiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BoardTile {
  id: string;
  text: string;
  category: string;
  priority: number;
}

const Board = () => {
  const navigate = useNavigate();
  const { questions, resetQuiz } = useQuiz();
  const [selectedTile, setSelectedTile] = useState<BoardTile | null>(null);
  const [currentCategory, setCurrentCategory] = useState('Basic Needs');

  // Generate board configuration based on quiz answers
  const generateBoardConfig = () => {
    const orgPreference = questions.find(q => q.id === 31)?.value || 'Mix of both approaches';
    const communicationNeeds = questions.find(q => q.id === 1)?.value;
    const interests = questions.find(q => q.id === 11)?.value;
    
    // Core phrases for top row
    const corePhases = [
      { id: 'core1', text: 'I need help', category: 'Core', priority: 1 },
      { id: 'core2', text: 'Please help me', category: 'Core', priority: 1 },
      { id: 'core3', text: 'Thank you', category: 'Core', priority: 1 },
      { id: 'core4', text: 'Yes', category: 'Core', priority: 1 },
      { id: 'core5', text: 'No', category: 'Core', priority: 1 },
      { id: 'core6', text: 'Please stop', category: 'Core', priority: 1 },
    ];

    // Category-based tiles
    const basicNeeds = [
      { id: 'basic1', text: 'I am hungry', category: 'Basic Needs', priority: 2 },
      { id: 'basic2', text: 'I am thirsty', category: 'Basic Needs', priority: 2 },
      { id: 'basic3', text: 'I need the bathroom', category: 'Basic Needs', priority: 2 },
      { id: 'basic4', text: 'I am tired', category: 'Basic Needs', priority: 2 },
      { id: 'basic5', text: 'I am hot', category: 'Basic Needs', priority: 2 },
      { id: 'basic6', text: 'I am cold', category: 'Basic Needs', priority: 2 },
    ];

    const feelings = [
      { id: 'feel1', text: 'I am happy', category: 'Feelings', priority: 3 },
      { id: 'feel2', text: 'I am sad', category: 'Feelings', priority: 3 },
      { id: 'feel3', text: 'I am angry', category: 'Feelings', priority: 3 },
      { id: 'feel4', text: 'I am scared', category: 'Feelings', priority: 3 },
      { id: 'feel5', text: 'I am excited', category: 'Feelings', priority: 3 },
      { id: 'feel6', text: 'I am confused', category: 'Feelings', priority: 3 },
    ];

    const actions = [
      { id: 'action1', text: 'I want to go', category: 'Actions', priority: 3 },
      { id: 'action2', text: 'I want to stay', category: 'Actions', priority: 3 },
      { id: 'action3', text: 'I want to play', category: 'Actions', priority: 3 },
      { id: 'action4', text: 'I want to rest', category: 'Actions', priority: 3 },
      { id: 'action5', text: 'I want to eat', category: 'Actions', priority: 3 },
      { id: 'action6', text: 'I want to talk', category: 'Actions', priority: 3 },
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
    return questions.find(q => q.id === 11)?.value || 'Not specified';
  };

  const handleTileClick = (tile: BoardTile) => {
    setSelectedTile(tile);
    // Simulate text-to-speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(tile.text);
      speechSynthesis.speak(utterance);
    }
  };

  const handleNewSetup = () => {
    if (confirm('Start a new setup? This will clear all current answers.')) {
      resetQuiz();
      navigate('/quiz');
    }
  };

  return (
    <div className="app-container">
      <div className="app-card max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Communication Board</h1>
            <p className="text-muted-foreground">Layout: {boardConfig.layout}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="secondary-button">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" className="secondary-button">
              <Volume2 className="h-4 w-4 mr-2" />
              AI Adapt
            </Button>
            <Button variant="outline" className="secondary-button">
              <Mic className="h-4 w-4 mr-2" />
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
                    All
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={currentCategory === category ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setCurrentCategory(category)}
                    >
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
                      className={`h-20 p-4 text-center whitespace-normal text-wrap border-2 transition-all ${
                        selectedTile?.id === tile.id 
                          ? 'border-green-400 bg-green-50' 
                          : 'border-gray-200 hover:border-primary hover:bg-accent'
                      }`}
                      onClick={() => handleTileClick(tile)}
                    >
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
                    <p className="text-2xl font-bold text-primary">{selectedTile.text}</p>
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
            New Setup
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Generated from your quiz responses • {boardConfig.tiles.length} tiles available
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;