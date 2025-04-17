import { MarathonRoute } from './marathon-routes';

// NYC Marathon route coordinates
export const nycMarathonRoute: MarathonRoute = {
  id: 'nyc',
  name: "TCS New York City Marathon",
  location: "New York City, USA",
  distance: 42.195, // kilometers
  elevationGain: 160,
  difficulty: 'moderate',
  courseRecord: '2:05:06',
  recordHolder: 'Geoffrey Mutai',
  recordYear: 2011,
  description: "The New York City Marathon is the largest marathon in the world, taking runners through all five boroughs of New York City. Starting at the Verrazzano-Narrows Bridge in Staten Island, the course winds through Brooklyn, Queens, Manhattan, and the Bronx before finishing in iconic Central Park.",
  coordinates: [
    // Start - Staten Island (Verrazzano-Narrows Bridge)
    [-74.0495, 40.6024],
    
    // Brooklyn
    [-74.0303, 40.6352], // Bay Ridge
    [-73.9992, 40.6557], // Sunset Park
    [-73.9762, 40.6882], // Downtown Brooklyn
    [-73.9545, 40.7037], // Williamsburg
    
    // Queens
    [-73.9519, 40.7445], // Long Island City
    [-73.9583, 40.7614], // Queensboro Bridge
    
    // Manhattan (First Avenue)
    [-73.9519, 40.7614], // Upper East Side
    [-73.9339, 40.7934], // East Harlem
    
    // Bronx
    [-73.9298, 40.8075], // Mott Haven
    [-73.9298, 40.8152], // The Hub
    
    // Manhattan (Fifth Avenue)
    [-73.9507, 40.7934], // Central Park North
    [-73.9507, 40.7744], // Central Park South
    
    // Finish - Central Park
    [-73.9747, 40.7686]
  ],
  imageUrl: '/images/nyc-marathon.jpg'
}; 