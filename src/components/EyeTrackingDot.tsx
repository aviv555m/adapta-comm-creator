import React from 'react';

interface EyeTrackingDotProps {
  x: number;
  y: number;
  isVisible: boolean;
}

export const EyeTrackingDot: React.FC<EyeTrackingDotProps> = ({ x, y, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed w-3 h-3 bg-red-500 rounded-full pointer-events-none z-50 transition-all duration-100"
      style={{
        left: `${x - 6}px`,
        top: `${y - 6}px`,
        boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
      }}
    />
  );
};