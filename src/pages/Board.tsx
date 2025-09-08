import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AAC_BOARDS, getSelectedBoard, AACItem } from '@/data/aacBoards';
import { useQuiz } from '@/hooks/useQuiz';

export default function Board() {
  const { language } = useLanguage();
  const { getSelectedBoard: getQuizBoard } = useQuiz();
  const [currentSentence, setCurrentSentence] = useState<string[]>([]);
  const [selectedBoard, setSelectedBoard] = useState('basic_simple');
  const [navigationPath, setNavigationPath] = useState<AACItem[]>([]);
  const [currentLevel, setCurrentLevel] = useState<AACItem[]>([]);

  const board = getSelectedBoard(selectedBoard);
  
  useEffect(() => {
    // Quiz board selection is handled by the board selector
    // Keep default board selection
  }, []);

  useEffect(() => {
    if (board.structure.length > 0) {
      setCurrentLevel(board.structure);
    }
  }, [board]);

  const handleItemClick = (item: AACItem) => {
    if (item.children && item.children.length > 0) {
      // Navigate deeper
      setNavigationPath(prev => [...prev, item]);
      setCurrentLevel(item.children);
    } else {
      // Add word to sentence
      addToSentence(item.text);
    }
  };

  const navigateBack = () => {
    if (navigationPath.length > 0) {
      const newPath = [...navigationPath];
      newPath.pop();
      setNavigationPath(newPath);
      
      if (newPath.length === 0) {
        setCurrentLevel(board.structure);
      } else {
        const parent = newPath[newPath.length - 1];
        setCurrentLevel(parent.children || []);
      }
    }
  };

  const resetToCategories = () => {
    setNavigationPath([]);
    setCurrentLevel(board.structure);
  };

  const addToSentence = (word: string) => {
    setCurrentSentence(prev => [...prev, word]);
    toast.success(`Added "${word}" to sentence`);
  };

  const speakSentence = () => {
    if (currentSentence.length > 0) {
      const text = currentSentence.join(' ');
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
      toast.success(`Speaking: "${text}"`);
    }
  };

  const clearSentence = () => {
    setCurrentSentence([]);
    toast.info('Sentence cleared');
  };

  const currentItems = currentLevel.slice(0, 9);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center mb-4">
          AAC Communication Board
        </h1>
        <p className="text-center text-muted-foreground mb-4">
          Welcome to your {board.name} - {board.description}
        </p>
        
        {/* Board Selector */}
        <div className="flex justify-center mb-4">
          <Select value={selectedBoard} onValueChange={setSelectedBoard}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a board" />
            </SelectTrigger>
            <SelectContent>
              {AAC_BOARDS.map((board) => (
                <SelectItem key={board.id} value={board.id}>
                  {board.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Navigation Breadcrumb */}
        {navigationPath.length > 0 && (
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Button variant="ghost" size="sm" onClick={resetToCategories}>
                Home
              </Button>
              {navigationPath.map((item, index) => (
                <span key={index} className="flex items-center gap-2">
                  <span>›</span>
                  <span>{item.text}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        {navigationPath.length > 0 && (
          <div className="flex justify-center mb-4">
            <Button variant="outline" onClick={navigateBack}>
              ← Back
            </Button>
          </div>
        )}
      </div>

      {/* Sentence Builder */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-lg font-medium">
              Sentence: {currentSentence.length > 0 ? currentSentence.join(' ') : 'Tap words to build a sentence...'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={speakSentence} disabled={currentSentence.length === 0}>
              🔊 Speak
            </Button>
            <Button variant="outline" onClick={clearSentence} disabled={currentSentence.length === 0}>
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {currentItems.map((item) => (
          <Card 
            key={item.id}
            className="p-4 hover:bg-accent cursor-pointer transition-colors border-2 hover:border-primary"
            onClick={() => handleItemClick(item)}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">
                {item.emoji}
              </div>
              <div className="font-medium">
                {item.text}
              </div>
              {item.children && item.children.length > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  ({item.children.length} items)
                </div>
              )}
            </div>
          </Card>
        ))}
        
        {/* More button - shows remaining items */}
        {currentLevel.length > 9 && (
          <Card 
            className="p-4 hover:bg-accent cursor-pointer transition-colors border-2 hover:border-primary bg-muted"
            onClick={() => {
              // Show next 9 items by cycling through
              const nextItems = currentLevel.slice(9);
              setCurrentLevel([...nextItems, ...currentLevel.slice(0, 9)]);
            }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">➕</div>
              <div className="font-medium">More</div>
              <div className="text-xs text-muted-foreground mt-1">
                ({currentLevel.length - 9} more)
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}