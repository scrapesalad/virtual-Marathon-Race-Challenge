import { MarathonPage } from '@/components/races/MarathonPage';

const berlinMarathon = {
  id: 'berlin-marathon',
  name: 'Berlin Marathon',
  description: 'Experience the fastest marathon course in the world through the historic streets of Berlin. Known for its flat terrain and record-breaking performances, the BMW Berlin Marathon takes you past iconic landmarks like the Brandenburg Gate, Reichstag, and Berlin Cathedral.',
  location: 'Berlin, Germany',
  distance: 42.195,
  elevationGain: 50,
  difficulty: 'moderate',
  coordinates: [
    [13.3755, 52.5163] as [number, number], // Start at Straße des 17. Juni
    [13.3800, 52.5200] as [number, number], // Victory Column
    [13.4000, 52.5200] as [number, number], // Tiergarten
    [13.4000, 52.5000] as [number, number], // Potsdamer Platz
    [13.4000, 52.4800] as [number, number], // Checkpoint Charlie
    [13.3800, 52.4800] as [number, number], // Gendarmenmarkt
    [13.3800, 52.5000] as [number, number], // Brandenburg Gate
    [13.3755, 52.5163] as [number, number], // Finish at Straße des 17. Juni
  ],
  milestones: [
    {
      distance: 0,
      location: 'Straße des 17. Juni',
      description: 'Start at the iconic boulevard in the heart of Berlin',
    },
    {
      distance: 10,
      location: 'Victory Column',
      description: 'Pass the golden statue in the middle of Tiergarten',
    },
    {
      distance: 20,
      location: 'Potsdamer Platz',
      description: 'Run through this modern square with its impressive architecture',
    },
    {
      distance: 30,
      location: 'Checkpoint Charlie',
      description: 'Pass the famous Cold War crossing point',
    },
    {
      distance: 35,
      location: 'Gendarmenmarkt',
      description: 'One of Berlin\'s most beautiful squares with its twin cathedrals',
    },
    {
      distance: 42.195,
      location: 'Brandenburg Gate',
      description: 'Finish at Berlin\'s most famous landmark',
    },
  ],
  image: '/images/races/berlin-marathon.jpg',
};

export default function BerlinMarathonPage() {
  return <MarathonPage marathon={berlinMarathon} />;
} 