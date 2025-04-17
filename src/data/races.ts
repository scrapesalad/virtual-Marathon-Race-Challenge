export const bostonMarathon = {
  id: 'boston-marathon',
  name: 'Boston Marathon',
  description: 'Experience the legendary Boston Marathon course virtually. From the rolling hills of Hopkinton to the iconic finish on Boylston Street.',
  location: 'Boston, Massachusetts',
  distance: 42.2,
  elevationGain: 247,
  difficulty: 'challenging',
  coordinates: [
    [42.2373, -71.5203], // Hopkinton
    [42.2796, -71.4162], // Framingham
    [42.2970, -71.2956], // Wellesley
    [42.3317, -71.1761], // Heartbreak Hill
    [42.3395, -71.1215], // Coolidge Corner
    [42.3501, -71.0777]  // Finish Line
  ] as [number, number][],
  milestones: [
    {
      distance: 0,
      location: 'Hopkinton',
      description: 'Start at the historic Hopkinton town center',
    },
    {
      distance: 10,
      location: 'Framingham',
      description: 'Pass through the first major town',
    },
    {
      distance: 20,
      location: 'Wellesley',
      description: 'Experience the famous Wellesley Scream Tunnel',
    },
    {
      distance: 30,
      location: 'Heartbreak Hill',
      description: 'Conquer the challenging Newton hills',
    },
    {
      distance: 35,
      location: 'Coolidge Corner',
      description: 'Enter the final stretch through Brookline',
    },
    {
      distance: 42.2,
      location: 'Boylston Street',
      description: 'Finish at the iconic Boston Marathon finish line',
    },
  ],
  image: '/images/races/boston-marathon.jpg',
};

export const newYorkMarathon = {
  id: 'nyc-marathon',
  name: 'New York City Marathon',
  description: 'Experience the energy of the Big Apple as you run through all five boroughs of New York City. The TCS New York City Marathon is the largest marathon in the world, with over 50,000 runners participating each year.',
  location: 'New York City, USA',
  distance: 42.195,
  elevationGain: 120,
  difficulty: 'challenging',
  coordinates: [
    [-73.9911, 40.7306], // Staten Island
    [-74.0060, 40.7128], // Brooklyn
    [-73.9352, 40.7306], // Queens
    [-73.9352, 40.7128], // Manhattan
    [-73.9911, 40.7128], // Bronx
    [-73.9911, 40.7306]  // Central Park Finish
  ] as [number, number][],
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

export const chicagoMarathon = {
  id: 'chicago-marathon',
  name: 'Chicago Marathon',
  description: 'Experience the flat and fast course through the heart of Chicago. Known for its speed and the incredible crowd support.',
  location: 'Chicago, Illinois',
  distance: 42.2,
  elevationGain: 120,
  difficulty: 'moderate',
  coordinates: [
    [41.8781, -87.6298], // Grant Park
    [41.8781, -87.6298], // Loop
    [41.8781, -87.6298], // North Side
    [41.8781, -87.6298], // West Side
    [41.8781, -87.6298], // South Side
    [41.8781, -87.6298]  // Finish
  ] as [number, number][],
  milestones: [
    {
      distance: 0,
      location: 'Grant Park',
      description: 'Start in the heart of Chicago',
    },
    {
      distance: 10,
      location: 'Lincoln Park',
      description: 'Run through Chicago\'s largest public park',
    },
    {
      distance: 20,
      location: 'West Loop',
      description: 'Experience the vibrant restaurant district',
    },
    {
      distance: 30,
      location: 'Pilsen',
      description: 'Enjoy the lively Latino neighborhood',
    },
    {
      distance: 35,
      location: 'Chinatown',
      description: 'Pass through the historic Chinese district',
    },
    {
      distance: 42.2,
      location: 'Grant Park',
      description: 'Finish back in beautiful Grant Park',
    },
  ],
  image: '/images/races/chicago-marathon.jpg'
};

export const londonMarathon = {
  id: 'london-marathon',
  name: 'London Marathon',
  description: 'Run through the historic streets of London, passing iconic landmarks like Tower Bridge, the London Eye, and Buckingham Palace.',
  location: 'London, United Kingdom',
  distance: 42.2,
  elevationGain: 150,
  difficulty: 'moderate',
  coordinates: [
    [51.5074, -0.1278], // Greenwich
    [51.5074, -0.1278], // Tower Bridge
    [51.5074, -0.1278], // Canary Wharf
    [51.5074, -0.1278], // Embankment
    [51.5074, -0.1278], // Buckingham Palace
    [51.5074, -0.1278]  // The Mall
  ] as [number, number][],
  milestones: [
    {
      distance: 0,
      location: 'Greenwich',
      description: 'Start at historic Greenwich Park',
    },
    {
      distance: 10,
      location: 'Tower Bridge',
      description: 'Cross the iconic Tower Bridge',
    },
    {
      distance: 20,
      location: 'Canary Wharf',
      description: 'Run through London\'s financial district',
    },
    {
      distance: 30,
      location: 'Embankment',
      description: 'Follow the Thames along Victoria Embankment',
    },
    {
      distance: 35,
      location: 'Westminster',
      description: 'Pass Big Ben and the Houses of Parliament',
    },
    {
      distance: 42.2,
      location: 'The Mall',
      description: 'Finish in front of Buckingham Palace',
    },
  ],
  image: '/images/races/london-marathon.jpg'
};

export const berlinMarathon = {
  id: 'berlin-marathon',
  name: 'Berlin Marathon',
  description: 'Experience the fastest marathon course in the world through the historic streets of Berlin. Known for its flat terrain and record-breaking performances, the BMW Berlin Marathon takes you past iconic landmarks like the Brandenburg Gate, Reichstag, and Berlin Cathedral.',
  location: 'Berlin, Germany',
  distance: 42.195,
  elevationGain: 50,
  difficulty: 'moderate',
  coordinates: [
    [13.3755, 52.5163], // Start at Straße des 17. Juni
    [13.3800, 52.5200], // Victory Column
    [13.4000, 52.5200], // Tiergarten
    [13.4000, 52.5000], // Potsdamer Platz
    [13.4000, 52.4800], // Checkpoint Charlie
    [13.3800, 52.4800], // Gendarmenmarkt
    [13.3800, 52.5000], // Brandenburg Gate
    [13.3755, 52.5163]  // Finish at Straße des 17. Juni
  ] as [number, number][],
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

export const tokyoMarathon = {
  id: 'tokyo-marathon',
  name: 'Tokyo Marathon',
  description: 'Experience the unique blend of traditional and modern Tokyo as you run through the city\'s most famous districts.',
  location: 'Tokyo, Japan',
  distance: 42.2,
  elevationGain: 180,
  difficulty: 'moderate',
  coordinates: [
    [35.6762, 139.6503], // Tokyo Metropolitan Government Building
    [35.6762, 139.6503], // Shinjuku
    [35.6762, 139.6503], // Asakusa
    [35.6762, 139.6503], // Ginza
    [35.6762, 139.6503], // Imperial Palace
    [35.6762, 139.6503]  // Tokyo Station
  ] as [number, number][]
};

export const allMarathons = [
  bostonMarathon,
  newYorkMarathon,
  chicagoMarathon,
  londonMarathon,
  berlinMarathon,
  tokyoMarathon
]; 