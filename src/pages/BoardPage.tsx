import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useEventLogger } from '@/hooks/useEventLogger';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { toast } from '@/hooks/use-toast';
import {
  Heart,
  Home,
  Utensils,
  Smile,
  Play,
  Users,
  MapPin,
  Rabbit,
  Palette,
  Hash,
  Clock,
  Star,
  Settings,
  Brain,
  Volume2,
  Eye,
  Languages,
  LogOut,
  Zap
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const categories: Category[] = [
  { id: 'most_used', name: 'Most Used', icon: <Star className="w-8 h-8" />, description: 'Your frequently used items' },
  { id: 'core', name: 'Core', icon: <Heart className="w-8 h-8" />, description: 'Essential communication words' },
  { id: 'basic_needs', name: 'Basic Needs', icon: <Home className="w-8 h-8" />, description: 'Daily necessities' },
  { id: 'food_drinks', name: 'Food & Drinks', icon: <Utensils className="w-8 h-8" />, description: 'Meals and beverages' },
  { id: 'emotions', name: 'Emotions', icon: <Smile className="w-8 h-8" />, description: 'Feelings and moods' },
  { id: 'actions', name: 'Actions', icon: <Play className="w-8 h-8" />, description: 'Things to do' },
  { id: 'people', name: 'People', icon: <Users className="w-8 h-8" />, description: 'Family and friends' },
  { id: 'places', name: 'Places', icon: <MapPin className="w-8 h-8" />, description: 'Locations and destinations' },
  { id: 'animals', name: 'Animals', icon: <Rabbit className="w-8 h-8" />, description: 'Pets and wildlife' },
  { id: 'colors', name: 'Colors', icon: <Palette className="w-8 h-8" />, description: 'Colors and shades' },
  { id: 'numbers', name: 'Numbers', icon: <Hash className="w-8 h-8" />, description: 'Numbers and counting' },
  { id: 'time', name: 'Time', icon: <Clock className="w-8 h-8" />, description: 'Time and schedule' }
];

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
];

const BoardPage = () => {
  const [profileSettings, setProfileSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useSupabaseAuth();
  const { logEvent } = useEventLogger();
  const { layout } = useResponsiveLayout();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadProfileSettings = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profile_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error loading profile settings:', error);
          navigate('/onboarding');
          return;
        }

        if (!data.onboarding_completed) {
          navigate('/onboarding');
          return;
        }

        setProfileSettings(data);
        await logEvent('board_viewed');
      } catch (error) {
        console.error('Error loading profile settings:', error);
        navigate('/onboarding');
      } finally {
        setLoading(false);
      }
    };

    loadProfileSettings();
  }, [user, isAuthenticated, navigate, logEvent]);

  const handleCategoryClick = async (category: Category) => {
    await logEvent('category_select', category.name);
    
    toast({
      title: `${category.name} Selected`,
      description: `Opening ${category.description.toLowerCase()}...`
    });
  };

  const handleLanguageChange = async (languageCode: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profile_settings')
        .update({ language: languageCode })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfileSettings(prev => ({ ...prev, language: languageCode }));
      await logEvent('language_changed', languageCode);

      toast({
        title: "Language Changed",
        description: `Switched to ${languages.find(l => l.code === languageCode)?.name}`
      });
    } catch (error) {
      console.error('Error changing language:', error);
      toast({
        title: "Error",
        description: "Failed to change language",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    await logEvent('logout');
    await signOut();
    navigate('/login');
  };

  const currentLanguage = languages.find(l => l.code === profileSettings?.language) || languages[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5"
      style={{ 
        fontSize: `${profileSettings?.font_size || layout.fontSize}px`,
        filter: profileSettings?.high_contrast ? 'contrast(150%)' : 'none'
      }}
    >
      {/* Header */}
      <header 
        className="bg-card/80 backdrop-blur-sm border-b shadow-sm"
        style={{ height: `${layout.headerHeight}px` }}
      >
        <div 
          className="max-w-full mx-auto px-4 h-full flex items-center justify-between"
          style={{ maxWidth: layout.containerMaxWidth }}
        >
          {/* App Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <div className="w-5 h-5 bg-white rounded-full"></div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Echoes Board</h1>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Languages className="w-4 h-4" />
                  <span>{currentLanguage.flag}</span>
                  <span className="hidden sm:inline">{currentLanguage.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className="gap-2"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <Button variant="outline" size="sm" title="Settings">
              <Settings className="w-4 h-4" />
            </Button>

            {/* AI Adapt */}
            <Button variant="outline" size="sm" title="AI Adaptation">
              <Brain className="w-4 h-4" />
            </Button>

            {/* Ready/Speech */}
            <Button variant="outline" size="sm" title="Speech Ready">
              <Volume2 className="w-4 h-4" />
            </Button>

            {/* Eye Track */}
            <Button variant="outline" size="sm" title="Eye Tracking">
              <Eye className="w-4 h-4" />
            </Button>

            {/* Logout */}
            <Button variant="outline" size="sm" onClick={handleLogout} title="Logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        <div 
          className="max-w-full mx-auto"
          style={{ maxWidth: layout.containerMaxWidth }}
        >
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Welcome to Your Communication Board
            </h2>
            <p className="text-muted-foreground">
              Choose a category to start communicating
            </p>
          </div>

          {/* Categories Grid */}
          <div 
            className="grid gap-4"
            style={{ 
              gridTemplateColumns: `repeat(${layout.gridCols}, 1fr)`,
              gap: `${layout.spacing}px`
            }}
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="group p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 hover:border-primary/50"
                style={{ 
                  minHeight: `${layout.buttonSize}px`,
                  aspectRatio: '1'
                }}
              >
                <div className="flex flex-col items-center justify-center h-full space-y-3">
                  <div className="text-primary group-hover:scale-110 transition-transform duration-200">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-foreground text-center leading-tight">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground text-center line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Status Info */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge variant="secondary" className="gap-1">
                <Zap className="w-3 h-3" />
                {profileSettings?.ai_adapt_enabled ? 'AI Enabled' : 'AI Disabled'}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Eye className="w-3 h-3" />
                {profileSettings?.input_method?.replace('_', ' ') || 'Touch'}
              </Badge>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BoardPage;