import React from 'react';
import { Map } from '@/components/Map';
import { MapRoute } from '@/types/route';

// Example NYC Marathon route coordinates (simplified)
const TEST_ROUTE: MapRoute = {
  coordinates: [
    [-74.0495, 40.6024], // Start - Staten Island
    [-73.9708, 40.6447], // Brooklyn
    [-73.9545, 40.7037], // Williamsburg
    [-73.9519, 40.7614], // Manhattan
    [-73.9339, 40.7934], // Harlem
    [-73.9507, 40.7744], // Central Park
    [-73.9747, 40.7686], // Finish Line
  ],
  progress: 35 // Example progress percentage
};

export default function MapTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Map Test Page
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <Map route={TEST_ROUTE} />
        </div>
      </div>
    </div>
  );
} 