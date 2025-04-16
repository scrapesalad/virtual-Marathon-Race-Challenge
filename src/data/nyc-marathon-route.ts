import { MarathonRoute } from './marathon-routes';

// NYC Marathon route coordinates
export const nycMarathonRoute: MarathonRoute = {
  id: 'nyc',
  name: "TCS New York City Marathon",
  location: "New York City, USA",
  distance: 42.195, // kilometers
  coordinates: [
    // Start - Verrazzano-Narrows Bridge
    [-74.0485, 40.6066],
    
    // Brooklyn
    [-73.9897, 40.6321],
    [-73.9612, 40.6512],
    [-73.9345, 40.6698],
    [-73.9078, 40.6884],
    
    // Queensboro Bridge
    [-73.9553, 40.7562],
    
    // Manhattan (First Avenue)
    [-73.9612, 40.7621],
    [-73.9345, 40.7621],
    [-73.9078, 40.7621],
    
    // Bronx
    [-73.9078, 40.8312],
    [-73.9078, 40.8512],
    
    // Back to Manhattan (Fifth Avenue)
    [-73.9078, 40.7621],
    [-73.9345, 40.7621],
    [-73.9612, 40.7621],
    
    // Central Park
    [-73.9612, 40.7821],
    [-73.9612, 40.7721],
    [-73.9612, 40.7621],
    
    // Finish - Central Park
    [-73.9665, 40.7795]
  ],
  description: "The New York City Marathon is the largest marathon in the world, taking runners through all five boroughs.",
  elevationGain: 160,
  difficulty: 'moderate',
  courseRecord: '2:05:06',
  imageUrl: '/images/nyc-marathon.jpg'
}; 