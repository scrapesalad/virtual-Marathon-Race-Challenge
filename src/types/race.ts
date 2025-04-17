export interface Milestone {
  distance: number;
  location: string;
  description: string;
}

export interface MarathonData {
  id: string;
  name: string;
  description: string;
  location: string;
  distance: number;
  elevationGain: number;
  difficulty: 'easy' | 'moderate' | 'hard' | 'extreme';
  coordinates: [number, number][];
  milestones: Milestone[];
  image: string;
  startDate: string;
  endDate: string;
} 