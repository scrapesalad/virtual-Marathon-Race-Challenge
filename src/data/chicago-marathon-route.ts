import { MarathonRoute } from './marathon-routes';

export const chicagoMarathonRoute: MarathonRoute = {
  id: 'chicago',
  name: 'Chicago Marathon',
  location: 'Chicago, Illinois, USA',
  distance: 42.2,
  elevationGain: 100,
  difficulty: 'easy',
  courseRecord: '2:03:45',
  recordHolder: 'Dennis Kimetto',
  recordYear: 2013,
  description: 'The Chicago Marathon is known for its flat and fast course, making it ideal for achieving personal bests. The route showcases Chicago\'s diverse neighborhoods and iconic architecture.',
  coordinates: [
    [-87.6196, 41.8715], // Start - Grant Park (Monroe St)
    [-87.6238, 41.8932], // Lincoln Park
    [-87.6476, 41.9107], // Wrigleyville
    [-87.6614, 41.8932], // West Loop
    [-87.6651, 41.8578], // Pilsen
    [-87.6349, 41.8352], // Bronzeville
    [-87.6238, 41.8505], // South Loop
    [-87.6196, 41.8715]  // Finish - Grant Park
  ],
  imageUrl: '/images/chicago-marathon.jpg'
}; 