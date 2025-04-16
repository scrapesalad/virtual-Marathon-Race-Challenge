export type AchievementCategory = 
  | 'distance'
  | 'speed'
  | 'consistency'
  | 'social'
  | 'special';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  criteria: {
    type: string;
    threshold: number;
    unit?: string;
  };
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
}

export interface UserAchievements {
  userId: string;
  achievements: Achievement[];
  totalPoints: number;
  rank: string;
} 