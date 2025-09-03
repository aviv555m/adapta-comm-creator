import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useQuiz } from '@/hooks/useQuiz';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Quiz = () => {
  const navigate = useNavigate();
  const {
    getCurrentQuestion,
    getStats,
    answerQuestion,
    skipQuestion,
    skipAllRemaining,
    goNext,
    goBack,
    canGoNext,
    canGoBack,
    isComplete,
    currentIndex,
    loading
  } = useQuiz();

  const [selectedValue, setSelectedValue] = useState<string>('');
  const [showSkipAllDialog, setShowSkipAllDialog] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [shakeCard, setShakeCard] = useState(false);

  const currentQuestion = getCurrentQuestion();
  const stats = getStats();

  // Reset selected value when question changes
  useEffect(() => {
    if (currentQuestion) {
      setSelectedValue(currentQuestion.value || '');
      setValidationError('');
    }
  }, [currentIndex, currentQuestion]);

  // Check if quiz is complete
  useEffect(() => {
    if (isComplete()) {
      navigate('/results');
    }
  }, [isComplete, navigate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            handleSkip();
            break;
          case 'a':
            e.preventDefault();
            setShowSkipAllDialog(true);
            break;
          case 'n':
            e.preventDefault();
            handleNext();
            break;
          case 'b':
            e.preventDefault();
            handleBack();
            break;
        }
      } else if (e.key === 'Escape') {
        // Would open menu - for demo just show alert
        alert('Menu shortcuts: Back (Alt+B), Skip (Alt+S), Skip All (Alt+A), Exit');
      } else if (e.key === 'Enter') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedValue, currentQuestion]);

  const handleAnswer = (value: string) => {
    setSelectedValue(value);
    setValidationError('');
    if (currentQuestion) {
      answerQuestion(currentQuestion.id, value);
    }
  };

  const handleNext = () => {
    if (!currentQuestion) return;

    if (!selectedValue && currentQuestion.status === 'unanswered') {
      setValidationError('Choose an option or press Skip.');
      setShakeCard(true);
      setTimeout(() => setShakeCard(false), 500);
      return;
    }

    if (selectedValue && currentQuestion.status === 'unanswered') {
      answerQuestion(currentQuestion.id, selectedValue);
    }

    goNext();
  };

  const handleBack = () => {
    goBack();
  };

  const handleSkip = () => {
    if (currentQuestion) {
      skipQuestion(currentQuestion.id);
      goNext();
    }
  };

  const handleSkipAll = () => {
    skipAllRemaining();
    setShowSkipAllDialog(false);
    navigate('/results');
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="app-card text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="app-container">
        <div className="app-card text-center">
          <p className="text-muted-foreground">Quiz completed!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className={`app-card ${shakeCard ? 'animate-pulse' : ''}`}>
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentIndex + 1} of {stats.total}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleBack} disabled={!canGoBack}>
                  Back
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSkip}>
                  Skip
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowSkipAllDialog(true)}>
                  Skip All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/results')}>
                  Exit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Progress value={stats.progress} className="w-full h-2" />
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            {currentQuestion.label}
          </h2>

          {/* Answer Options */}
          <RadioGroup 
            value={selectedValue} 
            onValueChange={handleAnswer}
            className="space-y-4"
          >
            {currentQuestion.options.map((option, index) => {
              // Extract emoji and text from option
              const emojiMatch = option.match(/^([^\w\s]+)/);
              const emoji = emojiMatch ? emojiMatch[1] : '';
              const text = option.replace(/^[^\w\s]+\s*/, '');
              
              return (
                <div key={index} className="flex items-center space-x-4">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <label 
                    htmlFor={`option-${index}`}
                    className="flex-1 p-6 border border-input rounded-xl hover:bg-accent cursor-pointer transition-colors flex items-center gap-4"
                  >
                    {emoji && (
                      <span className="text-[5rem] leading-none">{emoji}</span>
                    )}
                    <span className="text-sm font-medium">{text || option}</span>
                  </label>
                </div>
              );
            })}
          </RadioGroup>

          {/* Validation Error */}
          {validationError && (
            <p className="text-sm text-red-600 mt-3">{validationError}</p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={!canGoBack}
            className="secondary-button"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowSkipAllDialog(true)}
              className="h-12 text-red-600 border-red-200 hover:bg-red-50"
              title="Skip all remaining questions"
            >
              Skip All
            </Button>
            
            <Button
              variant="secondary"
              onClick={handleSkip}
              className="secondary-button"
              title="Skip this question and leave it unanswered"
            >
              Skip
            </Button>

            <Button
              onClick={handleNext}
              className="primary-button"
              disabled={!canGoNext}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Skip All Confirmation Dialog */}
        <AlertDialog open={showSkipAllDialog} onOpenChange={setShowSkipAllDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Skip all remaining questions?</AlertDialogTitle>
              <AlertDialogDescription>
                You can answer later in Settings.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSkipAll} className="primary-button">
                Skip all
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Quiz;