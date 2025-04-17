import { marathonRoutes } from '@/data/marathon-routes';
import { RaceDetails } from '@/components/races/RaceDetails';
import { notFound } from 'next/navigation';

interface RacePageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return marathonRoutes.map((route) => ({
    id: route.id,
  }));
}

export default function RacePage({ params }: RacePageProps) {
  const route = marathonRoutes.find((r) => r.id === params.id);
  
  if (!route) {
    notFound();
  }

  const raceData = {
    id: route.id,
    name: route.name,
    description: route.description,
    location: route.location,
    distance: route.distance,
    elevationGain: route.elevationGain,
    difficulty: route.difficulty,
    startDate: route.startDate || new Date().toISOString(),
    endDate: route.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    courseRecord: route.courseRecord,
    recordHolder: route.recordHolder,
    recordYear: route.recordYear,
    route: {
      coordinates: route.coordinates,
    },
    participants: [] // We'll fetch participants from the database in a future update
  };

  return <RaceDetails race={raceData} />;
} 