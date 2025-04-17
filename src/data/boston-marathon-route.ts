import { MarathonRoute } from './marathon-routes';

export const bostonMarathonRoute: MarathonRoute = {
  id: 'boston',
  name: 'Boston Marathon',
  location: 'Boston, Massachusetts, USA',
  distance: 42.2,
  elevationGain: 150,
  difficulty: 'challenging',
  courseRecord: '2:03:02',
  recordHolder: 'Geoffrey Mutai',
  recordYear: 2011,
  description: 'The Boston Marathon is the world\'s oldest annual marathon and one of the most prestigious road racing events. Known for its challenging course, particularly the "Heartbreak Hill" section, it attracts elite runners from around the world.',
  coordinates: [
    [-71.1473, 42.2287], // Start in Hopkinton
    [-71.2736, 42.2331], // Ashland
    [-71.3598, 42.2773], // Framingham
    [-71.4167, 42.2945], // Natick
    [-71.4736, 42.3097], // Wellesley
    [-71.5181, 42.3319], // Newton Lower Falls
    [-71.5473, 42.3486], // Heartbreak Hill
    [-71.5848, 42.3578], // Boston College
    [-71.6153, 42.3512], // Brookline
    [-71.0709, 42.3512]  // Finish in Boston
  ],
  imageUrl: '/images/boston-marathon.jpg'
}; 