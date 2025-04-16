'use client';

import { RaceManagement } from '@/components/RaceManagement';
import { useParams } from 'next/navigation';

export default function RaceManagementPage() {
  const params = useParams();
  const raceId = params.id as string;

  return (
    <div className="container mx-auto py-12 px-4">
      <RaceManagement raceId={raceId} />
    </div>
  );
} 