import { notFound } from 'next/navigation';
import { RaceDetails } from '@/components/races/RaceDetails';
import { getMarathonRouteById } from '@/data/marathon-routes';

interface RacePageProps {
  params: {
    id: string;
  };
}

export default async function RacePage({ params }: RacePageProps) {
  // Ensure params.id is properly awaited
  const id = await Promise.resolve(params.id);
  const race = getMarathonRouteById(id);

  if (!race) {
    notFound();
  }

  // Convert the marathon route data to match the RaceDetails component props
  const raceData = {
    ...race,
    startDate: new Date().toISOString(), // You should replace this with actual race dates
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    route: {
      coordinates: race.coordinates
    },
    participants: [] // You should fetch actual participants from your database
  };

  return <RaceDetails race={raceData} />;
} 