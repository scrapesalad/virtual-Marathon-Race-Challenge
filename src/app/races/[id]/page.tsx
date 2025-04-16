import { notFound } from 'next/navigation';
import { MarathonPage } from '@/components/races/MarathonPage';
import { allMarathons } from '@/data/races';

interface RacePageProps {
  params: {
    id: string;
  };
}

export default function RacePage({ params }: RacePageProps) {
  const race = allMarathons.find(race => race.id === params.id);

  if (!race) {
    notFound();
  }

  return <MarathonPage marathon={race} />;
} 