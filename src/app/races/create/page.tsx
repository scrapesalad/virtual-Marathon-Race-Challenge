'use client';

import { useRouter } from 'next/navigation';
import { RaceCreationForm } from '@/components/RaceCreationForm';

export default function CreateRacePage() {
  const router = useRouter();

  const handleSubmit = async (raceData: any) => {
    try {
      const response = await fetch('/api/races', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(raceData),
      });

      if (!response.ok) {
        throw new Error('Failed to create race');
      }

      const data = await response.json();
      router.push(`/races/${data.id}`);
    } catch (error) {
      console.error('Error creating race:', error);
      // TODO: Show error message to user
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <RaceCreationForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
} 