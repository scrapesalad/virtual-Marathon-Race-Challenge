// Top 10 marathon routes from around the world
// Each route includes name, location, distance, and key coordinates

export interface MarathonRoute {
  id: string;
  name: string;
  location: string;
  distance: number; // in kilometers
  coordinates: [number, number][]; // [longitude, latitude]
  description: string;
  elevationGain: number; // in meters
  difficulty: 'easy' | 'moderate' | 'challenging' | 'difficult';
  courseRecord: string;
  imageUrl?: string; // URL to a representative image
}

const DEFAULT_RACE_IMAGE = '/images/default-race.jpg';

// Top 10 marathons data
export const marathonRoutes: MarathonRoute[] = [
  {
    id: 'boston',
    name: 'Boston Marathon',
    location: 'Boston, Massachusetts, USA',
    distance: 42.2,
    elevationGain: 150,
    difficulty: 'challenging',
    courseRecord: '2:03:02',
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
    imageUrl: '/images/boston-marathon.jpg' // Updated to use the new image
  },
  {
    id: 'nyc',
    name: 'New York City Marathon',
    location: 'New York City, USA',
    distance: 42.2,
    elevationGain: 160,
    difficulty: 'moderate',
    courseRecord: '2:05:06',
    description: 'The New York City Marathon is the largest marathon in the world, with over 50,000 finishers. The course takes runners through all five boroughs of New York City, offering iconic views of the city\'s landmarks.',
    coordinates: [
      [40.7128, -74.0060], // Staten Island
      [40.6782, -73.9442], // Brooklyn
      [40.7282, -73.7949], // Queens
      [40.7589, -73.9851], // Manhattan
      [40.7829, -73.9654], // Bronx
      [40.7589, -73.9851], // Manhattan (Finish)
    ],
    imageUrl: DEFAULT_RACE_IMAGE
  },
  {
    id: 'chicago',
    name: 'Chicago Marathon',
    location: 'Chicago, Illinois, USA',
    distance: 42.2,
    elevationGain: 100,
    difficulty: 'easy',
    courseRecord: '2:03:45',
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
    imageUrl: DEFAULT_RACE_IMAGE
  },
  {
    id: 'berlin',
    name: 'Berlin Marathon',
    location: 'Berlin, Germany',
    distance: 42.2,
    elevationGain: 80,
    difficulty: 'easy',
    courseRecord: '2:01:09',
    description: 'The Berlin Marathon is known for being one of the fastest marathon courses in the world. The flat course and ideal weather conditions have contributed to numerous world records being set here.',
    coordinates: [
      [52.5200, 13.4050], // Start
      [52.5200, 13.4050], // Tiergarten
      [52.5200, 13.4050], // Mitte
      [52.5200, 13.4050], // Kreuzberg
      [52.5200, 13.4050], // Finish
    ],
    imageUrl: DEFAULT_RACE_IMAGE
  },
  {
    id: 'tokyo',
    name: 'Tokyo Marathon',
    location: 'Tokyo, Japan',
    distance: 42.2,
    elevationGain: 120,
    difficulty: 'moderate',
    courseRecord: '2:04:56',
    description: 'The Tokyo Marathon is one of the World Marathon Majors and offers runners a unique experience through the heart of Tokyo. The course combines modern cityscapes with traditional Japanese landmarks.',
    coordinates: [
      [35.6762, 139.6503], // Start
      [35.6762, 139.6503], // Shinjuku
      [35.6762, 139.6503], // Ginza
      [35.6762, 139.6503], // Asakusa
      [35.6762, 139.6503], // Finish
    ],
    imageUrl: DEFAULT_RACE_IMAGE
  },
  {
    id: 'london-marathon',
    name: 'London Marathon',
    location: 'London, UK',
    distance: 42.2,
    coordinates: [
      // Start - Greenwich Park
      [0.0077, 51.4769],
      
      // Through Greenwich
      [0.0077, 51.4869],
      [0.0077, 51.4969],
      
      // Cutty Sark
      [0.0077, 51.4821],
      
      // Through Deptford
      [0.0277, 51.4821],
      
      // Tower Bridge
      [-0.0753, 51.5055],
      
      // Canary Wharf
      [-0.0277, 51.5055],
      
      // The Highway
      [-0.0477, 51.5055],
      
      // Embankment
      [-0.1277, 51.5055],
      
      // Big Ben
      [-0.1246, 51.5007],
      
      // Buckingham Palace
      [-0.1419, 51.5014],
      
      // The Mall (Finish)
      [-0.1419, 51.5014]
    ],
    description: 'The London Marathon is known for its flat course and fast times. Runners pass by famous landmarks including the Tower Bridge, Big Ben, and Buckingham Palace.',
    elevationGain: 100,
    difficulty: 'moderate',
    courseRecord: '2:01:09',
    imageUrl: DEFAULT_RACE_IMAGE
  },
  {
    id: 'paris-marathon',
    name: 'Paris Marathon',
    location: 'Paris, France',
    distance: 42.2,
    coordinates: [
      // Start - Champs-Élysées
      [2.3522, 48.8566],
      
      // Place de la Concorde
      [2.3522, 48.8666],
      
      // Louvre
      [2.3522, 48.8766],
      
      // Bastille
      [2.3722, 48.8766],
      
      // Bois de Vincennes
      [2.4322, 48.8766],
      
      // Back to Seine
      [2.3722, 48.8766],
      
      // Eiffel Tower
      [2.2922, 48.8566],
      
      // Trocadéro
      [2.2922, 48.8666],
      
      // Finish - Avenue Foch
      [2.2922, 48.8766]
    ],
    description: 'The Paris Marathon takes runners through the beautiful streets of Paris, passing by iconic landmarks such as the Eiffel Tower, Notre-Dame, and the Louvre.',
    elevationGain: 120,
    difficulty: 'moderate',
    courseRecord: '2:05:04',
    imageUrl: DEFAULT_RACE_IMAGE
  },
  {
    id: 'great-wall-marathon',
    name: 'Great Wall Marathon',
    location: 'Tianjin, China',
    distance: 42.2,
    coordinates: [
      // Start - Badaling
      [116.0054, 40.3775],
      
      // Through Mutianyu
      [116.0054, 40.3775],
      
      // Through Jiankou
      [116.0054, 40.3775],
      
      // Through Simatai
      [116.0054, 40.3775],
      
      // Through Jinshanling
      [116.0054, 40.3775],
      
      // Through Huanghuacheng
      [116.0054, 40.3775],
      
      // Through Mutianyu
      [116.0054, 40.3775],
      
      // Through Jiankou
      [116.0054, 40.3775],
      
      // Through Simatai
      [116.0054, 40.3775],
      
      // Through Jinshanling
      [116.0054, 40.3775]
    ],
    description: 'The Great Wall Marathon is one of the most challenging marathons in the world. Runners must climb over 5,000 steps along the Great Wall of China.',
    elevationGain: 5164,
    difficulty: 'difficult',
    courseRecord: '3:09:17',
    imageUrl: DEFAULT_RACE_IMAGE
  },
  {
    id: 'comrades-marathon',
    name: 'Comrades Marathon',
    location: 'Durban to Pietermaritzburg, South Africa',
    distance: 89,
    coordinates: [
      // Start - Durban
      [30.9612, -29.8584],
      
      // Through Pietermaritzburg
      [29.8584, -29.8584],
      
      // Through Hillcrest
      [29.8584, -29.8584],
      
      // Through Howick
      [29.8584, -29.8584],
      
      // Through Kloof
      [29.8584, -29.8584],
      
      // Through Pietermaritzburg
      [29.8584, -29.8584],
      
      // Through Howick
      [29.8584, -29.8584],
      
      // Through Kloof
      [29.8584, -29.8584],
      
      // Through Pietermaritzburg
      [29.8584, -29.8584],
      
      // Finish - Pietermaritzburg
      [29.8584, -29.8584]
    ],
    description: 'The Comrades Marathon is an ultramarathon of approximately 89 kilometers. It is the oldest and largest ultramarathon race in the world.',
    elevationGain: 1500,
    difficulty: 'difficult',
    courseRecord: '5:24:49',
    imageUrl: DEFAULT_RACE_IMAGE
  },
  {
    id: 'santorini-marathon',
    name: 'Santorini Marathon',
    location: 'Santorini, Greece',
    distance: 42.2,
    coordinates: [
      // Start - Oia
      [25.3994, 36.4014],
      
      // Through Fira
      [25.3994, 36.4014],
      
      // Through Imerovigli
      [25.3994, 36.4014],
      
      // Through Oia
      [25.3994, 36.4014],
      
      // Through Imerovigli
      [25.3994, 36.4014],
      
      // Through Oia
      [25.3994, 36.4014],
      
      // Through Imerovigli
      [25.3994, 36.4014],
      
      // Through Oia
      [25.3994, 36.4014],
      
      // Through Imerovigli
      [25.3994, 36.4014],
      
      // Through Oia
      [25.3994, 36.4014]
    ],
    description: 'The Santorini Marathon offers stunning views of the Aegean Sea and the island\'s iconic white buildings. The course includes challenging hills but rewards runners with breathtaking scenery.',
    elevationGain: 350,
    difficulty: 'challenging',
    courseRecord: '2:45:00',
    imageUrl: DEFAULT_RACE_IMAGE
  }
];

// Helper function to get a marathon route by ID
export function getMarathonRouteById(id: string): MarathonRoute | undefined {
  return marathonRoutes.find(route => route.id === id);
}

// Helper function to get all marathon routes
export function getAllMarathonRoutes(): MarathonRoute[] {
  return marathonRoutes;
} 