export interface MapRoute {
  coordinates: [number, number][];
  progress: number; // Progress as a percentage (0-100)
}

export interface RaceRoute {
  id: string;
  name: string;
  location: string;
  distance: number; // in kilometers
  coordinates: [number, number][]; // [longitude, latitude]
  description: string;
  elevationGain: number; // in meters
  difficulty: 'easy' | 'moderate' | 'challenging' | 'difficult';
  courseRecord: string;
  imageUrl?: string;
} 