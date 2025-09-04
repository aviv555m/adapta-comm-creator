import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DebugComponent = () => {
  const navigate = useNavigate();

  const testNavigation = (path: string) => {
    console.log(`Testing navigation to: ${path}`);
    try {
      navigate(path);
      console.log(`Navigation to ${path} successful`);
    } catch (error) {
      console.error(`Navigation to ${path} failed:`, error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Navigation Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={() => testNavigation('/quiz')} 
          className="w-full"
        >
          Test Quiz Navigation
        </Button>
        <Button 
          onClick={() => testNavigation('/board')} 
          className="w-full"
        >
          Test Board Navigation
        </Button>
        <Button 
          onClick={() => testNavigation('/results')} 
          className="w-full"
        >
          Test Results Navigation
        </Button>
        <Button 
          onClick={() => testNavigation('/onboarding')} 
          className="w-full"
        >
          Test Onboarding Navigation
        </Button>
        <Button 
          onClick={() => {
            console.log('Current location:', window.location.pathname);
            console.log('User agent:', navigator.userAgent);
          }} 
          className="w-full"
        >
          Log Current State
        </Button>
      </CardContent>
    </Card>
  );
};