import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, RotateCcw, ArrowRight } from 'lucide-react';
import { useQuiz } from '@/hooks/useQuiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Results = () => {
  const navigate = useNavigate();
  const { questions, getStats, resetQuiz, events } = useQuiz();
  const stats = getStats();

  // Configuration checker
  const checkConfiguration = () => {
    const warnings = [];
    const conflicts = [];
    const suggestions = [];

    // Check skip rate
    const skipRate = (stats.skipped / stats.total) * 100;
    if (skipRate > 70) {
      warnings.push({
        type: 'warning',
        message: 'Many questions were skipped. Defaults will be used.',
        action: 'Consider reviewing unanswered questions'
      });
    }

    // Check for specific conflicts
    const accessMethod = questions.find(q => q.id === 2)?.value;
    const deviceType = questions.find(q => q.id === 4)?.value;
    
    if (accessMethod === 'Eye gaze' && deviceType === 'Smartphone only') {
      conflicts.push({
        type: 'conflict',
        message: 'Eye gaze access method conflicts with smartphone-only device',
        action: 'Consider using a tablet or dedicated AAC device for eye gaze',
        fixable: true
      });
    }

    // Check organization preference
    const orgPreference = questions.find(q => q.id === 31);
    if (orgPreference?.status === 'answered') {
      suggestions.push({
        type: 'info',
        message: `Board will be organized: ${orgPreference.value}`,
        action: 'This setting will be applied to your communication board'
      });
    }

    return { warnings, conflicts, suggestions };
  };

  const { warnings, conflicts, suggestions } = checkConfiguration();

  const handleGenerateBoard = () => {
    navigate('/board');
  };

  const handleReviewAnswers = () => {
    // Simply navigate back to quiz - the useQuiz hook will handle the state
    navigate('/quiz');
  };

  return (
    <div className="app-container">
      <div className="app-card max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Summary</h1>
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-lg font-medium">{stats.answered} answered</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="text-lg font-medium">{stats.skipped} skipped</span>
            </div>
          </div>
        </div>

        {/* Configuration Checker */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Configuration Check</span>
            </CardTitle>
            <CardDescription>
              Analyzing your responses for consistency and conflicts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Warnings */}
            {warnings.map((warning, index) => (
              <div key={index} className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">{warning.message}</p>
                    <p className="text-sm text-yellow-700 mt-1">{warning.action}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Conflicts */}
            {conflicts.map((conflict, index) => (
              <div key={index} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800">{conflict.message}</p>
                      <p className="text-sm text-red-700 mt-1">{conflict.action}</p>
                    </div>
                  </div>
                  {conflict.fixable && (
                    <Button size="sm" variant="outline" className="text-red-700 border-red-300">
                      Fix
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {/* Suggestions */}
            {suggestions.map((suggestion, index) => (
              <div key={index} className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">{suggestion.message}</p>
                    <p className="text-sm text-blue-700 mt-1">{suggestion.action}</p>
                  </div>
                </div>
              </div>
            ))}

            {warnings.length === 0 && conflicts.length === 0 && suggestions.length === 0 && (
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="font-medium text-green-800">Configuration looks good!</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>All Questions</CardTitle>
            <CardDescription>Review your responses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {questions.map((question) => (
                <div key={question.id} className="flex items-start justify-between p-3 border border-border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        Q{question.id}
                      </span>
                      <Badge variant={question.status === 'answered' ? 'default' : 'secondary'}>
                        {question.status}
                      </Badge>
                    </div>
                    <p className="font-medium text-sm mb-2">{question.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {question.status === 'answered' ? question.value : 'Skipped'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleReviewAnswers}
            className="secondary-button"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Review Answers
          </Button>

          <Button
            onClick={handleGenerateBoard}
            className="primary-button"
          >
            Generate My Board
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Analytics Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Session Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{events.length}</p>
                <p className="text-sm text-muted-foreground">Total Actions</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{stats.answered}</p>
                <p className="text-sm text-muted-foreground">Questions Answered</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{stats.skipped}</p>
                <p className="text-sm text-muted-foreground">Questions Skipped</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{Math.round(stats.progress)}%</p>
                <p className="text-sm text-muted-foreground">Completion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Results;