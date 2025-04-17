import { MarathonRoute } from './marathon-routes';

export const berlinMarathonRoute: MarathonRoute = {
  id: 'berlin',
  name: 'Berlin Marathon',
  location: 'Berlin, Germany',
  distance: 42.2,
  elevationGain: 80,
  difficulty: 'easy',
  courseRecord: '2:01:09',
  recordHolder: 'Eliud Kipchoge',
  recordYear: 2022,
  description: 'The Berlin Marathon is known for being one of the fastest marathon courses in the world. The flat course and ideal weather conditions have contributed to numerous world records being set here.',
  coordinates: [
    [13.3755, 52.5163], // Start at Straße des 17. Juni
    [13.3800, 52.5200], // Victory Column
    [13.4000, 52.5200], // Tiergarten
    [13.4000, 52.5000], // Potsdamer Platz
    [13.4000, 52.4800], // Checkpoint Charlie
    [13.3800, 52.4800], // Gendarmenmarkt
    [13.3800, 52.5000], // Brandenburg Gate
    [13.3755, 52.5163]  // Finish at Straße des 17. Juni
  ],
  imageUrl: '/images/berlin-marathon.jpg'
}; 