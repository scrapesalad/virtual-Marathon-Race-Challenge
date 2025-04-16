export interface Marathon {
  id: string;
  name: string;
  description: string;
  distance: number;
  elevationGain: number;
  difficulty: 'easy' | 'moderate' | 'hard' | 'extreme';
  location: string;
  startDate: string;
  endDate: string;
  route: [number, number][];
  markers: {
    id: string;
    title: string;
    description: string;
    coordinates: [number, number];
    type: 'funny' | 'scary' | 'interesting' | 'warning';
  }[];
} 