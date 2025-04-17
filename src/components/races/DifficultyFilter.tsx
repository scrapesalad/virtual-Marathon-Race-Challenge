'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import type { MarathonData } from '@/types/race';

interface DifficultyFilterProps {
  onSelectRace: (race: MarathonData) => void;
}

const difficultyOptions = [
  { value: 'easy', label: 'Easy', description: 'Perfect for beginners' },
  { value: 'moderate', label: 'Moderate', description: 'Good for intermediate runners' },
  { value: 'hard', label: 'Hard', description: 'Challenging for experienced runners' },
  { value: 'extreme', label: 'Extreme', description: 'For elite runners only' },
];

const marathonOptions: Record<string, MarathonData[]> = {
  easy: [
    {
      id: 'chicago-marathon',
      name: 'Chicago Marathon',
      description: 'Known for its flat course and enthusiastic crowd support',
      distance: 42.2,
      elevationGain: 100,
      difficulty: 'easy',
      location: 'Chicago, IL',
      coordinates: [],
      milestones: [],
      image: '/images/races/chicago.jpg',
      startDate: new Date('2024-10-13').toISOString(),
      endDate: new Date('2024-10-13').toISOString()
    },
    {
      id: 'berlin-marathon',
      name: 'Berlin Marathon',
      description: 'One of the fastest marathon courses in the world',
      distance: 42.2,
      elevationGain: 150,
      difficulty: 'easy',
      location: 'Berlin, Germany',
      coordinates: [],
      milestones: [],
      image: '/images/races/berlin.jpg',
      startDate: new Date('2024-09-29').toISOString(),
      endDate: new Date('2024-09-29').toISOString()
    },
  ],
  moderate: [
    {
      id: 'boston-marathon',
      name: 'Boston Marathon',
      description: 'Historic race with challenging hills',
      distance: 42.2,
      elevationGain: 500,
      difficulty: 'moderate',
      location: 'Boston, MA',
      coordinates: [],
      milestones: [],
      image: '/images/races/boston.jpg',
      startDate: new Date('2024-04-15').toISOString(),
      endDate: new Date('2024-04-15').toISOString()
    },
    {
      id: 'new-york-marathon',
      name: 'New York City Marathon',
      description: 'Iconic race through all five boroughs',
      distance: 42.2,
      elevationGain: 400,
      difficulty: 'moderate',
      location: 'New York, NY',
      coordinates: [],
      milestones: [],
      image: '/images/races/nyc.jpg',
      startDate: new Date('2024-11-03').toISOString(),
      endDate: new Date('2024-11-03').toISOString()
    },
  ],
  hard: [
    {
      id: 'comrades-marathon',
      name: 'Comrades Marathon',
      description: 'Ultra-marathon with significant elevation changes',
      distance: 89.0,
      elevationGain: 2000,
      difficulty: 'hard',
      location: 'Durban, South Africa',
      coordinates: [],
      milestones: [],
      image: '/images/races/comrades.jpg',
      startDate: new Date('2024-06-09').toISOString(),
      endDate: new Date('2024-06-09').toISOString()
    },
    {
      id: 'western-states',
      name: 'Western States 100',
      description: '100-mile trail race through the Sierra Nevada',
      distance: 160.9,
      elevationGain: 5500,
      difficulty: 'hard',
      location: 'Squaw Valley, CA',
      coordinates: [],
      milestones: [],
      image: '/images/races/western-states.jpg',
      startDate: new Date('2024-06-29').toISOString(),
      endDate: new Date('2024-06-30').toISOString()
    },
  ],
  extreme: [
    {
      id: 'barkley-marathons',
      name: 'Barkley Marathons',
      description: 'One of the most challenging races in the world',
      distance: 100.0,
      elevationGain: 60000,
      difficulty: 'extreme',
      location: 'Frozen Head State Park, TN',
      coordinates: [],
      milestones: [],
      image: '/images/races/barkley.jpg',
      startDate: new Date('2024-03-01').toISOString(),
      endDate: new Date('2024-03-02').toISOString()
    },
    {
      id: 'spartathlon',
      name: 'Spartathlon',
      description: '246km race from Athens to Sparta',
      distance: 246.0,
      elevationGain: 3000,
      difficulty: 'extreme',
      location: 'Athens to Sparta, Greece',
      coordinates: [],
      milestones: [],
      image: '/images/races/spartathlon.jpg',
      startDate: new Date('2024-09-27').toISOString(),
      endDate: new Date('2024-09-28').toISOString()
    },
  ],
};

export function DifficultyFilter({ onSelectRace }: DifficultyFilterProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {difficultyOptions.map((option) => (
          <Button
            key={option.value}
            variant={selectedDifficulty === option.value ? 'default' : 'outline'}
            className="h-auto py-4 flex flex-col items-center justify-center"
            onClick={() => setSelectedDifficulty(option.value)}
          >
            <span className="text-lg font-semibold">{option.label}</span>
            <span className="text-sm text-gray-500">{option.description}</span>
          </Button>
        ))}
      </div>

      {selectedDifficulty && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">
            {difficultyOptions.find(opt => opt.value === selectedDifficulty)?.label} Marathons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {marathonOptions[selectedDifficulty].map((race) => (
              <Card key={race.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold">{race.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{race.description}</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <p>📍 {race.location}</p>
                    <p>📅 {new Date(race.startDate).toLocaleDateString()}</p>
                    <p>🏃‍♂️ {race.distance}km</p>
                    <p>⛰️ {race.elevationGain}m elevation gain</p>
                  </div>
                  <Button
                    className="mt-4 w-full"
                    onClick={() => onSelectRace(race)}
                  >
                    Select Race
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 