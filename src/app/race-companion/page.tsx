'use client';

import { AIRaceCompanion } from '@/components/AIRaceCompanion';

export default function RaceCompanionPage() {
  // Mock data for demonstration
  const mockRaceData = {
    currentPace: '5:30',
    targetPace: '5:45',
    distanceCompleted: 15.7,
    totalDistance: 42.2,
    currentLocation: 'Downtown District',
    nextLandmark: 'Central Park',
    distanceToLandmark: 0.8,
    nearbyRunners: 3,
    weatherConditions: {
      temperature: 22,
      condition: 'Partly Cloudy',
      windSpeed: 18,
      windDirection: 'North'
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Race Companion</h1>
      <div className="max-w-2xl mx-auto">
        <AIRaceCompanion {...mockRaceData} />
      </div>
    </div>
  );
} 