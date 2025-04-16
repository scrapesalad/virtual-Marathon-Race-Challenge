'use client';

import { useState } from 'react';
import { DifficultyFilter } from '@/components/races/DifficultyFilter';
import { Marathon } from '@/types';
import { useRouter } from 'next/navigation';

export default function RacesPage() {
  const router = useRouter();
  const [selectedRace, setSelectedRace] = useState<Marathon | null>(null);

  const handleSelectRace = (race: Marathon) => {
    setSelectedRace(race);
    router.push(`/races/${race.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Choose Your Race</h1>
      <p className="text-lg text-gray-600 mb-8">
        Select a difficulty level to see available races. Each race has unique challenges and experiences.
      </p>
      
      <DifficultyFilter onSelectRace={handleSelectRace} />
    </div>
  );
} 