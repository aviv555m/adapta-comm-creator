import { useState, useEffect, useCallback } from 'react';
import { BoardTile } from '../types/board';
import { BoardSettings } from '../components/BoardSettingsDialog';

interface InteractionEvent {
  timestamp: number;
  type: 'tile_click' | 'category_switch' | 'eye_tracking' | 'voice_command' | 'session_start' | 'session_end';
  data: {
    tileId?: string;
    category?: string;
    duration?: number;
    success?: boolean;
    errorType?: string;
  };
}

interface BehaviorPattern {
  preferredTiles: string[];
  preferredCategories: string[];
  averageSessionTime: number;
  peakUsageTimes: number[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  communicationStyle: 'visual' | 'text' | 'mixed';
  accessibilityNeeds: {
    needsLargerTiles: boolean;
    needsSlowerSpeech: boolean;
    needsHighContrast: boolean;
    needsSimpleLayout: boolean;
  };
}

interface Recommendation {
  id: string;
  type: 'settings' | 'layout' | 'vocabulary' | 'timing';
  priority: 'high' | 'medium' | 'low';
  description: string;
  action: Partial<BoardSettings>;
  confidence: number;
}

export const useBehaviorAnalytics = () => {
  const [interactions, setInteractions] = useState<InteractionEvent[]>(() => {
    const stored = localStorage.getItem('echoes_behavior_analytics');
    return stored ? JSON.parse(stored) : [];
  });

  const [currentSession, setCurrentSession] = useState<{
    startTime: number;
    interactions: number;
    categories: Set<string>;
    tiles: Set<string>;
  }>({
    startTime: Date.now(),
    interactions: 0,
    categories: new Set(),
    tiles: new Set()
  });

  const [behaviorPattern, setBehaviorPattern] = useState<BehaviorPattern | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  // Save interactions to localStorage
  useEffect(() => {
    localStorage.setItem('echoes_behavior_analytics', JSON.stringify(interactions));
  }, [interactions]);

  // Analyze behavior patterns every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (interactions.length > 0) {
        analyzeBehaviorPatterns();
        generateRecommendations();
      }
    }, 30000); // Analyze every 30 seconds

    return () => clearInterval(interval);
  }, [interactions]);

  const trackInteraction = useCallback((event: Omit<InteractionEvent, 'timestamp'>) => {
    const newInteraction: InteractionEvent = {
      ...event,
      timestamp: Date.now()
    };

    setInteractions(prev => [...prev, newInteraction]);
    
    // Update current session
    setCurrentSession(prev => ({
      ...prev,
      interactions: prev.interactions + 1,
      categories: event.data.category ? new Set([...prev.categories, event.data.category]) : prev.categories,
      tiles: event.data.tileId ? new Set([...prev.tiles, event.data.tileId]) : prev.tiles
    }));
  }, []);

  const analyzeBehaviorPatterns = useCallback(() => {
    if (interactions.length < 10) return; // Need minimum data

    const last24Hours = Date.now() - (24 * 60 * 60 * 1000);
    const recentInteractions = interactions.filter(i => i.timestamp > last24Hours);

    // Analyze tile usage patterns
    const tileUsage = new Map<string, number>();
    const categoryUsage = new Map<string, number>();
    
    recentInteractions.forEach(interaction => {
      if (interaction.data.tileId) {
        tileUsage.set(interaction.data.tileId, (tileUsage.get(interaction.data.tileId) || 0) + 1);
      }
      if (interaction.data.category) {
        categoryUsage.set(interaction.data.category, (categoryUsage.get(interaction.data.category) || 0) + 1);
      }
    });

    // Calculate session times
    const sessions = groupInteractionsBySessions(recentInteractions);
    const averageSessionTime = sessions.reduce((acc, session) => acc + session.duration, 0) / sessions.length;

    // Determine difficulty level based on usage patterns
    const uniqueTilesUsed = tileUsage.size;
    const averageClicksPerTile = Array.from(tileUsage.values()).reduce((a, b) => a + b, 0) / uniqueTilesUsed;
    
    let difficultyLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
    if (uniqueTilesUsed > 20 && averageClicksPerTile > 3) {
      difficultyLevel = 'advanced';
    } else if (uniqueTilesUsed > 10 && averageClicksPerTile > 2) {
      difficultyLevel = 'intermediate';
    }

    // Analyze accessibility needs
    const errorRate = recentInteractions.filter(i => i.data.success === false).length / recentInteractions.length;
    const averageInteractionTime = calculateAverageInteractionTime(recentInteractions);

    const accessibilityNeeds = {
      needsLargerTiles: errorRate > 0.2 || averageInteractionTime > 3000,
      needsSlowerSpeech: averageSessionTime > 300000, // Long sessions might indicate processing difficulty
      needsHighContrast: errorRate > 0.15,
      needsSimpleLayout: uniqueTilesUsed < 8 && categoryUsage.size < 3
    };

    const pattern: BehaviorPattern = {
      preferredTiles: Array.from(tileUsage.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([tileId]) => tileId),
      preferredCategories: Array.from(categoryUsage.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([category]) => category),
      averageSessionTime,
      peakUsageTimes: calculatePeakUsageTimes(recentInteractions),
      difficultyLevel,
      communicationStyle: determineCommuncationStyle(recentInteractions),
      accessibilityNeeds
    };

    setBehaviorPattern(pattern);
  }, [interactions]);

  const generateRecommendations = useCallback(() => {
    if (!behaviorPattern) return;

    const newRecommendations: Recommendation[] = [];

    // Accessibility recommendations
    if (behaviorPattern.accessibilityNeeds.needsLargerTiles) {
      newRecommendations.push({
        id: 'larger-tiles',
        type: 'settings',
        priority: 'high',
        description: 'הילד נראה מתקשה ללחוץ על הכפתורים. מומלץ להגדיל את גודל הכפתורים.',
        action: { tileSize: 8 },
        confidence: 0.85
      });
    }

    if (behaviorPattern.accessibilityNeeds.needsSlowerSpeech) {
      newRecommendations.push({
        id: 'slower-speech',
        type: 'settings', 
        priority: 'medium',
        description: 'הילד נראה זקוק לזמן עיבוד יותר. מומלץ להאט את מהירות הדיבור.',
        action: { voiceRate: 0.7 },
        confidence: 0.75
      });
    }

    if (behaviorPattern.accessibilityNeeds.needsHighContrast) {
      newRecommendations.push({
        id: 'high-contrast',
        type: 'settings',
        priority: 'medium', 
        description: 'הילד מתקשה לראות את הכפתורים. מומלץ להפעיל מצב ניגודיות גבוהה.',
        action: { highContrast: true },
        confidence: 0.8
      });
    }

    // Vocabulary recommendations
    if (behaviorPattern.preferredCategories.length > 0) {
      newRecommendations.push({
        id: 'optimize-categories',
        type: 'layout',
        priority: 'medium',
        description: `הילד משתמש בעיקר בקטגוריות: ${behaviorPattern.preferredCategories.slice(0, 3).join(', ')}. מומלץ להציב אותן במקום בולט.`,
        action: { enabledCategories: behaviorPattern.preferredCategories },
        confidence: 0.9
      });
    }

    // Timing recommendations
    const currentHour = new Date().getHours();
    if (behaviorPattern.peakUsageTimes.includes(currentHour)) {
      newRecommendations.push({
        id: 'peak-time-optimization',
        type: 'timing',
        priority: 'low',
        description: 'זהו זמן שיא לשימוש. הלוח מותאם לביצועים מיטביים.',
        action: {},
        confidence: 0.7
      });
    }

    setRecommendations(newRecommendations);
  }, [behaviorPattern]);

  // Helper functions
  const groupInteractionsBySessions = (interactions: InteractionEvent[]) => {
    const sessions: { startTime: number; endTime: number; duration: number }[] = [];
    let currentSession: { startTime: number; endTime: number } | null = null;
    
    interactions.forEach(interaction => {
      if (!currentSession || interaction.timestamp - currentSession.endTime > 300000) { // 5 minute gap = new session
        if (currentSession) {
          sessions.push({
            ...currentSession,
            duration: currentSession.endTime - currentSession.startTime
          });
        }
        currentSession = { startTime: interaction.timestamp, endTime: interaction.timestamp };
      } else {
        currentSession.endTime = interaction.timestamp;
      }
    });

    if (currentSession) {
      sessions.push({
        ...currentSession,
        duration: currentSession.endTime - currentSession.startTime
      });
    }

    return sessions;
  };

  const calculateAverageInteractionTime = (interactions: InteractionEvent[]) => {
    const clickInteractions = interactions.filter(i => i.type === 'tile_click');
    if (clickInteractions.length < 2) return 0;

    let totalTime = 0;
    for (let i = 1; i < clickInteractions.length; i++) {
      totalTime += clickInteractions[i].timestamp - clickInteractions[i-1].timestamp;
    }
    
    return totalTime / (clickInteractions.length - 1);
  };

  const calculatePeakUsageTimes = (interactions: InteractionEvent[]) => {
    const hourlyUsage = new Map<number, number>();
    
    interactions.forEach(interaction => {
      const hour = new Date(interaction.timestamp).getHours();
      hourlyUsage.set(hour, (hourlyUsage.get(hour) || 0) + 1);
    });

    return Array.from(hourlyUsage.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => hour);
  };

  const determineCommuncationStyle = (interactions: InteractionEvent[]): 'visual' | 'text' | 'mixed' => {
    const tileClicks = interactions.filter(i => i.type === 'tile_click').length;
    const voiceCommands = interactions.filter(i => i.type === 'voice_command').length;
    
    if (voiceCommands > tileClicks * 0.5) return 'mixed';
    return 'visual';
  };

  const startSession = useCallback(() => {
    setCurrentSession({
      startTime: Date.now(),
      interactions: 0,
      categories: new Set(),
      tiles: new Set()
    });
    
    trackInteraction({
      type: 'session_start',
      data: {}
    });
  }, [trackInteraction]);

  const endSession = useCallback(() => {
    trackInteraction({
      type: 'session_end',
      data: {
        duration: Date.now() - currentSession.startTime
      }
    });
  }, [trackInteraction, currentSession.startTime]);

  const applyRecommendation = useCallback((recommendationId: string) => {
    setRecommendations(prev => prev.filter(r => r.id !== recommendationId));
  }, []);

  return {
    trackInteraction,
    behaviorPattern,
    recommendations,
    currentSession,
    startSession,
    endSession,
    applyRecommendation,
    interactions: interactions.length
  };
};