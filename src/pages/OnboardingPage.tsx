import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { toast } from '@/hooks/use-toast';
import { 
  Languages, 
  Mouse, 
  Eye, 
  Keyboard, 
  Hand,
  Palette,
  Type,
  Volume2,
  User,
  Baby,
  Users,
  Brain,
  Shield
} from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  question: string;
  options: Array<{
    value: string;
    label: string;
    icon: React.ReactNode;
    description?: string;
  }>;
  field: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Language Selection",
    question: "What language would you like to use?",
    field: "language",
    options: [
      { value: "en", label: "English", icon: <Languages className="w-6 h-6" />, description: "English" },
      { value: "he", label: "עברית", icon: <Languages className="w-6 h-6" />, description: "Hebrew" },
      { value: "ru", label: "Русский", icon: <Languages className="w-6 h-6" />, description: "Russian" },
      { value: "es", label: "Español", icon: <Languages className="w-6 h-6" />, description: "Spanish" }
    ]
  },
  {
    id: 2,
    title: "Input Method",
    question: "How would you prefer to interact with the board?",
    field: "input_method",
    options: [
      { value: "touch", label: "Touch", icon: <Hand className="w-6 h-6" />, description: "Tap buttons directly" },
      { value: "mouse", label: "Mouse", icon: <Mouse className="w-6 h-6" />, description: "Click with mouse" },
      { value: "eye_tracking", label: "Eye Tracking", icon: <Eye className="w-6 h-6" />, description: "Look to select" },
      { value: "keyboard", label: "Keyboard", icon: <Keyboard className="w-6 h-6" />, description: "Use keyboard navigation" }
    ]
  },
  {
    id: 3,
    title: "Visual Settings",
    question: "Choose your visual preferences:",
    field: "high_contrast",
    options: [
      { value: "false", label: "Standard", icon: <Palette className="w-6 h-6" />, description: "Regular colors and contrast" },
      { value: "true", label: "High Contrast", icon: <Palette className="w-6 h-6" />, description: "Enhanced visibility" }
    ]
  },
  {
    id: 4,
    title: "Text Size",
    question: "What text size works best for you?",
    field: "font_size", 
    options: [
      { value: "14", label: "Small", icon: <Type className="w-4 h-4" />, description: "Compact text" },
      { value: "16", label: "Medium", icon: <Type className="w-5 h-5" />, description: "Standard size" },
      { value: "18", label: "Large", icon: <Type className="w-6 h-6" />, description: "Easy to read" },
      { value: "20", label: "Extra Large", icon: <Type className="w-7 h-7" />, description: "Maximum readability" }
    ]
  },
  {
    id: 5,
    title: "Personal Info",
    question: "Who will be using this board?",
    field: "age_group",
    options: [
      { value: "child", label: "Child", icon: <Baby className="w-6 h-6" />, description: "Under 12 years old" },
      { value: "teen", label: "Teenager", icon: <User className="w-6 h-6" />, description: "13-17 years old" },
      { value: "adult", label: "Adult", icon: <Users className="w-6 h-6" />, description: "18+ years old" }
    ]
  },
  {
    id: 6,
    title: "AI Adaptation",
    question: "Allow AI to adapt the interface based on usage?",
    field: "ai_adapt_enabled",
    options: [
      { value: "true", label: "Yes, Enable", icon: <Brain className="w-6 h-6" />, description: "AI learns and improves your experience" },
      { value: "false", label: "No, Disable", icon: <Shield className="w-6 h-6" />, description: "Keep interface static" }
    ]
  }
];

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { layout } = useResponsiveLayout();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check if user has already completed onboarding
    const checkOnboardingStatus = () => {
      try {
        const settings = localStorage.getItem('adaptacomm_settings');
        if (settings) {
          const parsedSettings = JSON.parse(settings);
          if (parsedSettings.onboarding_completed) {
            navigate('/board');
            return;
          }
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setChecking(false);
      }
    };

    checkOnboardingStatus();
  }, [user, isAuthenticated, navigate]);

  const handleAnswerSelect = (value: string) => {
    const step = onboardingSteps[currentStep];
    const newAnswers = { ...answers, [step.field]: value };
    setAnswers(newAnswers);

    // Auto-advance to next step after short delay
    setTimeout(() => {
      if (currentStep < onboardingSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }, 500);
  };

  const handleComplete = () => {
    setLoading(true);
    try {
      const settings = {
        ...answers,
        font_size: parseInt(answers.font_size || '16'),
        high_contrast: answers.high_contrast === 'true',
        ai_adapt_enabled: answers.ai_adapt_enabled === 'true',
        onboarding_completed: true
      };

      localStorage.setItem('adaptacomm_settings', JSON.stringify(settings));
      
      toast({
        title: "Setup Complete!",
        description: "Welcome to your personalized communication board."
      });

      navigate('/board');
    } catch (error) {
      console.error('Error saving onboarding:', error);
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;
  const step = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;
  const isAnswered = answers[step?.field];

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-4"
      style={{ fontSize: `${layout.fontSize}px` }}
    >
      <div 
        className="w-full bg-card rounded-xl shadow-xl border p-8 space-y-8"
        style={{ 
          maxWidth: `${Math.min(800, layout.buttonSize * 6)}px`
        }}
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Welcome Setup</h1>
          <p className="text-muted-foreground">
            Step {currentStep + 1} of {onboardingSteps.length}
          </p>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Question */}
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            {step.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {step.question}
          </p>
        </div>

        {/* Options */}
        <div 
          className="grid gap-4"
          style={{ 
            gridTemplateColumns: `repeat(${Math.min(step.options.length, 2)}, 1fr)`,
            gap: `${layout.spacing}px`
          }}
        >
          {step.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswerSelect(option.value)}
              className={`
                p-6 rounded-lg border-2 transition-all duration-200 text-left
                ${answers[step.field] === option.value 
                  ? 'border-primary bg-primary/10 shadow-md' 
                  : 'border-border hover:border-primary/50 hover:bg-accent/50'
                }
              `}
              style={{ 
                minHeight: `${layout.buttonSize}px`
              }}
            >
              <div className="flex items-center gap-4">
                <div className={`
                  p-3 rounded-full
                  ${answers[step.field] === option.value 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {option.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{option.label}</h3>
                  {option.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          {isLastStep && isAnswered && (
            <Button
              onClick={handleComplete}
              disabled={loading}
              className="px-8"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Completing...
                </div>
              ) : (
                "Complete Setup"
              )}
            </Button>
          )}

          {!isLastStep && (
            <div className="text-sm text-muted-foreground">
              {isAnswered ? "Moving to next step..." : "Select an option to continue"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;