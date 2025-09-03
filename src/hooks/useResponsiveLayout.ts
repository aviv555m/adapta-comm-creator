import { useState, useEffect } from 'react';

interface ScreenDimensions {
  width: number;
  height: number;
}

interface LayoutConfig {
  containerMaxWidth: string;
  gridCols: number;
  buttonSize: number;
  fontSize: number;
  spacing: number;
  headerHeight: number;
}

export const useResponsiveLayout = () => {
  const [dimensions, setDimensions] = useState<ScreenDimensions>({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getLayoutConfig = (): LayoutConfig => {
    const { width, height } = dimensions;

    // Determine grid configuration based on screen size
    let gridCols = 4;
    let buttonSize = 120;
    let fontSize = 16;
    let spacing = 16;
    let headerHeight = 80;

    if (width >= 2560) {
      // 4K and ultra-wide
      gridCols = 6;
      buttonSize = 140;
      fontSize = 18;
      spacing = 24;
      headerHeight = 100;
    } else if (width >= 1920) {
      // 1920x1080 and similar
      gridCols = 5;
      buttonSize = 130;
      fontSize = 17;
      spacing = 20;
      headerHeight = 90;
    } else if (width >= 1366) {
      // 1366x768 and similar
      gridCols = 4;
      buttonSize = 120;
      fontSize = 16;
      spacing = 16;
      headerHeight = 80;
    } else if (width >= 768) {
      // Tablet
      gridCols = 3;
      buttonSize = 110;
      fontSize = 15;
      spacing = 12;
      headerHeight = 70;
    } else {
      // Mobile
      gridCols = 2;
      buttonSize = 100;
      fontSize = 14;
      spacing = 8;
      headerHeight = 60;
    }

    // Adjust for very small heights
    if (height < 600) {
      buttonSize = Math.max(80, buttonSize - 20);
      headerHeight = Math.max(50, headerHeight - 20);
    }

    return {
      containerMaxWidth: width > 2560 ? '2560px' : '100%',
      gridCols,
      buttonSize,
      fontSize,
      spacing,
      headerHeight
    };
  };

  return {
    dimensions,
    layout: getLayoutConfig()
  };
};