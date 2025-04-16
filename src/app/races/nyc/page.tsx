import { MarathonPage } from '@/components/races/MarathonPage';

const nycMarathon = {
  id: 'nyc-marathon',
  name: 'New York City Marathon',
  description: 'Experience the energy of the Big Apple as you run through all five boroughs of New York City. The TCS New York City Marathon is the largest marathon in the world, with over 50,000 runners participating each year.',
  location: 'New York City, USA',
  distance: 42.195,
  elevationGain: 120,
  difficulty: 'challenging',
  coordinates: [
    [-73.9911, 40.7306] as [number, number], // Staten Island
    [-74.0060, 40.7128] as [number, number], // Brooklyn
    [-73.9352, 40.7306] as [number, number], // Queens
    [-73.9352, 40.7128] as [number, number], // Manhattan
    [-73.9911, 40.7128] as [number, number], // Bronx
    [-73.9911, 40.7306] as [number, number], // Central Park Finish
  ],
  milestones: [
    {
      distance: 0,
      location: 'Staten Island',
      description: 'Start at the Verrazzano-Narrows Bridge',
    },
    {
      distance: 10,
      location: 'Brooklyn',
      description: 'Run through diverse neighborhoods and cheering crowds',
    },
    {
      distance: 20,
      location: 'Queens',
      description: 'Cross the Queensboro Bridge into Manhattan',
    },
    {
      distance: 30,
      location: 'Manhattan',
      description: 'Run up First Avenue with massive crowds',
    },
    {
      distance: 35,
      location: 'Bronx',
      description: 'Short but challenging section through the Bronx',
    },
    {
      distance: 42.195,
      location: 'Central Park',
      description: 'Finish in the iconic Central Park',
    },
  ],
  image: '/images/races/nyc-marathon.jpg',
};

export default function NYCMarathonPage() {
  return <MarathonPage marathon={nycMarathon} />;
} 