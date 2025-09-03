import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Settings, Zap, Eye, Mic } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { BoardSettings } from './BoardSettingsDialog';
import { useBehaviorAnalytics } from '@/hooks/useBehaviorAnalytics';

interface AIControlPanelProps {
  onUpdateSettings: (settings: Partial<BoardSettings>) => void;
  currentSettings: BoardSettings;
  isOpen: boolean;
  onClose: () => void;
}

export const AIControlPanel: React.FC<AIControlPanelProps> = ({
  onUpdateSettings,
  currentSettings,
  isOpen,
  onClose
}) => {
  const { behaviorPattern, recommendations, applyRecommendation } = useBehaviorAnalytics();
  const [aiStatus, setAiStatus] = useState<'analyzing' | 'ready' | 'adapting'>('ready');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const { toast } = useToast();

  // Simulate AI analysis progress
  useEffect(() => {
    if (aiStatus === 'analyzing') {
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            setAiStatus('ready');
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [aiStatus]);

  const startAnalysis = () => {
    setAiStatus('analyzing');
    setAnalysisProgress(0);
    toast({
      title: 'מתחיל ניתוח התנהגות',
      description: 'הבינה המלאכותית מנתחת את דפוסי השימוש של הילד...'
    });
  };

  const applyAllRecommendations = () => {
    if (recommendations.length === 0) return;

    setAiStatus('adapting');
    
    // Apply high priority recommendations first
    const highPriorityRecs = recommendations.filter(r => r.priority === 'high');
    const mediumPriorityRecs = recommendations.filter(r => r.priority === 'medium');
    
    let allChanges: Partial<BoardSettings> = {};
    
    [...highPriorityRecs, ...mediumPriorityRecs].forEach(rec => {
      allChanges = { ...allChanges, ...rec.action };
      applyRecommendation(rec.id);
    });

    onUpdateSettings(allChanges);
    
    setTimeout(() => {
      setAiStatus('ready');
      toast({
        title: 'התאמות יושמו בהצלחה',
        description: `${highPriorityRecs.length + mediumPriorityRecs.length} המלצות יושמו אוטומטית`
      });
    }, 2000);
  };

  const applyIndividualRecommendation = (recommendation: any) => {
    onUpdateSettings(recommendation.action);
    applyRecommendation(recommendation.id);
    toast({
      title: 'המלצה יושמה',
      description: recommendation.description
    });
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed top-4 right-4 z-50 w-[480px] h-[600px] shadow-2xl border-2 border-primary">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          מרכז בקרה AI
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0"
        >
          ✕
        </Button>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 space-y-4 overflow-y-auto max-h-[520px]">
        {/* AI Status */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">סטטוס AI</span>
            <Badge variant={aiStatus === 'ready' ? 'default' : 'secondary'}>
              {aiStatus === 'ready' && '🟢 מוכן'}
              {aiStatus === 'analyzing' && '🟡 מנתח'}
              {aiStatus === 'adapting' && '🟠 מתאים'}
            </Badge>
          </div>
          
          {aiStatus === 'analyzing' && (
            <div>
              <Progress value={analysisProgress} className="mb-2" />
              <p className="text-xs text-muted-foreground">מנתח דפוסי התנהגות...</p>
            </div>
          )}
        </div>

        {/* Behavior Analysis */}
        {behaviorPattern && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                ניתוח התנהגות
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm font-medium">רמת קושי:</span>
                <Badge className="mr-2" variant="outline">
                  {behaviorPattern.difficultyLevel === 'beginner' && 'מתחיל'}
                  {behaviorPattern.difficultyLevel === 'intermediate' && 'בינוני'}
                  {behaviorPattern.difficultyLevel === 'advanced' && 'מתקדם'}
                </Badge>
              </div>
              
              <div>
                <span className="text-sm font-medium">קטגוריות מועדפות:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {behaviorPattern.preferredCategories.slice(0, 3).map(cat => (
                    <Badge key={cat} variant="secondary" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-sm font-medium">זמן הפעלה ממוצע:</span>
                <span className="text-sm text-muted-foreground mr-2">
                  {Math.round(behaviorPattern.averageSessionTime / 60000)} דקות
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Recommendations */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4" />
              המלצות AI ({recommendations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recommendations.length === 0 ? (
              <p className="text-sm text-muted-foreground">אין המלצות חדשות כרגע</p>
            ) : (
              <div className="space-y-3">
                {recommendations.map(rec => (
                  <div key={rec.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {rec.priority === 'high' && 'גבוה'}
                            {rec.priority === 'medium' && 'בינוני'}
                            {rec.priority === 'low' && 'נמוך'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            ביטחון: {Math.round(rec.confidence * 100)}%
                          </span>
                        </div>
                        <p className="text-sm">{rec.description}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => applyIndividualRecommendation(rec)}
                        className="mr-2"
                      >
                        יישם
                      </Button>
                    </div>
                  </div>
                ))}
                
                {recommendations.filter(r => r.priority === 'high' || r.priority === 'medium').length > 1 && (
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={applyAllRecommendations}
                    disabled={aiStatus === 'adapting'}
                  >
                    {aiStatus === 'adapting' ? 'מיישם...' : 'יישם את כל ההמלצות החשובות'}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Controls */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" />
              בקרות AI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={startAnalysis}
              disabled={aiStatus === 'analyzing'}
            >
              <Brain className="h-4 w-4 mr-2" />
              {aiStatus === 'analyzing' ? 'מנתח...' : 'בצע ניתוח מלא'}
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                // Auto-optimize based on current session
                const optimizations: Partial<BoardSettings> = {};
                
                // Simple auto-optimizations
                if (currentSettings.tileSize < 6) {
                  optimizations.tileSize = 7; // Make tiles bigger for easier access
                }
                
                if (currentSettings.voiceRate > 1.2) {
                  optimizations.voiceRate = 1.0; // Slower speech for better comprehension
                }

                onUpdateSettings(optimizations);
                toast({
                  title: 'אופטימיזציה אוטומטית',
                  description: 'הלוח אופטם אוטומטית לביצועים טובים יותר'
                });
              }}
            >
              <Zap className="h-4 w-4 mr-2" />
              אופטימיזציה אוטומטית
            </Button>
          </CardContent>
        </Card>

        {/* Real-time Monitoring */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4" />
              ניטור בזמן אמת
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>אינטרקציות בהפעלה:</span>
                <span className="font-mono">{behaviorPattern?.preferredTiles.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>קטגוריות בשימוש:</span>
                <span className="font-mono">{behaviorPattern?.preferredCategories.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>סגנון תקשורת:</span>
                <span>{behaviorPattern?.communicationStyle === 'visual' ? 'ויזואלי' : behaviorPattern?.communicationStyle === 'mixed' ? 'מעורב' : 'טקסט'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};