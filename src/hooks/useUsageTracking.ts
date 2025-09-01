import { useState, useEffect } from 'react';
import { BoardTile } from '../types/board';

interface TileUsage {
  tileId: string;
  count: number;
  lastUsed: number;
}

interface UseUsageTrackingReturn {
  usage: Record<string, TileUsage>;
  trackTileUsage: (tileId: string) => void;
  getMostUsedTiles: (tiles: BoardTile[], limit?: number) => BoardTile[];
  clearUsageData: () => void;
}

export const useUsageTracking = (): UseUsageTrackingReturn => {
  const [usage, setUsage] = useState<Record<string, TileUsage>>(() => {
    const stored = localStorage.getItem('echoes_tile_usage');
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem('echoes_tile_usage', JSON.stringify(usage));
  }, [usage]);

  const trackTileUsage = (tileId: string): void => {
    setUsage(prev => ({
      ...prev,
      [tileId]: {
        tileId,
        count: (prev[tileId]?.count || 0) + 1,
        lastUsed: Date.now()
      }
    }));
  };

  const getMostUsedTiles = (tiles: BoardTile[], limit = 12): BoardTile[] => {
    return tiles
      .filter(tile => usage[tile.id]?.count > 0)
      .sort((a, b) => (usage[b.id]?.count || 0) - (usage[a.id]?.count || 0))
      .slice(0, limit);
  };

  const clearUsageData = (): void => {
    setUsage({});
    localStorage.removeItem('echoes_tile_usage');
  };

  return {
    usage,
    trackTileUsage,
    getMostUsedTiles,
    clearUsageData
  };
};