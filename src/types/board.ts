export interface BoardTile {
  id: string;
  text: string;
  emoji?: string;
  category: string;
  priority: number;
}

export interface BoardCategory {
  name: string;
  emoji: string;
  tiles: BoardTile[];
}

export interface BoardConfig {
  tiles: BoardTile[];
  categories: string[];
  layout: string;
}