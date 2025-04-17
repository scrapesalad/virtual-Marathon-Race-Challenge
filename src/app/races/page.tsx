'use client';

import { getAllMarathonRoutes } from '@/data/marathon-routes';
import { RaceCard } from '@/components/races/RaceCard';

export default function RacesPage() {
  const races = getAllMarathonRoutes();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Choose your race</h1>
        <p className="text-gray-600">
          Select from our collection of virtual marathons from around the world
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {races.map((race) => (
          <RaceCard key={race.id} race={race} />
        ))}
      </div>
    </div>
  );
} 