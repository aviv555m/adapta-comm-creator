import { useState, useEffect, useRef } from 'react';

interface EyeTrackingData {
  x: number;
  y: number;
  timestamp: number;
}

interface UseEyeTrackingReturn {
  isCalibrated: boolean;
  isCalibrating: boolean;
  eyePosition: EyeTrackingData | null;
  startCalibration: () => Promise<void>;
  stopEyeTracking: () => void;
  isTrackingActive: boolean;
}

export const useEyeTracking = (): UseEyeTrackingReturn => {
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [isTrackingActive, setIsTrackingActive] = useState(false);
  const [eyePosition, setEyePosition] = useState<EyeTrackingData | null>(null);
  const webgazerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (webgazerRef.current && window.webgazer) {
        window.webgazer.end();
      }
    };
  }, []);

  const startCalibration = async (): Promise<void> => {
    try {
      setIsCalibrating(true);
      
      // Import webgazer dynamically
      const webgazer = await import('webgazer');
      webgazerRef.current = webgazer.default;
      
      // Request camera permissions
      await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Initialize webgazer
      await webgazer.default
        .setRegression('ridge')
        .setTracker('clmtrackr')
        .setGazeListener((data: any) => {
          if (data) {
            setEyePosition({
              x: data.x,
              y: data.y,
              timestamp: Date.now()
            });
          }
        })
        .begin();

      // Hide the default webgazer UI
      webgazer.default.showVideoPreview(false);
      webgazer.default.showPredictionPoints(false);
      webgazer.default.showFaceOverlay(false);
      webgazer.default.showFaceFeedbackBox(false);

      // Simulate calibration process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setIsCalibrated(true);
      setIsTrackingActive(true);
      setIsCalibrating(false);
    } catch (error) {
      console.error('Eye tracking calibration failed:', error);
      setIsCalibrating(false);
    }
  };

  const stopEyeTracking = (): void => {
    if (webgazerRef.current && window.webgazer) {
      window.webgazer.end();
    }
    setIsCalibrated(false);
    setIsTrackingActive(false);
    setEyePosition(null);
  };

  return {
    isCalibrated,
    isCalibrating,
    eyePosition,
    startCalibration,
    stopEyeTracking,
    isTrackingActive
  };
};

// Add webgazer types to window
declare global {
  interface Window {
    webgazer: any;
  }
}