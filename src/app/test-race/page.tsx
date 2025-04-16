"use client";

import { useState, useEffect } from 'react';
import { DynamicMap } from '@/components/DynamicMap';

// NYC Marathon route coordinates (simplified)
const NYC_MARATHON_COORDS: [number, number][] = [
  [-74.0525, 40.6024], // Staten Island Start
  [-73.9712, 40.6827], // Brooklyn
  [-73.9442, 40.7282], // Queens
  [-73.9851, 40.7589], // Manhattan First Pass
  [-73.9654, 40.7829], // Bronx
  [-73.9697, 40.7685]  // Central Park Finish
];

export default function TestRacePage() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev + 1) % 101);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Race Progress Test</h1>
      <div className="mb-4">
        Progress: {progress}%
      </div>
      <div className="h-[600px] border rounded-lg overflow-hidden">
        <DynamicMap 
          coordinates={NYC_MARATHON_COORDS}
          progress={progress}
          className="w-full h-full"
        />
      </div>
    </div>
  );
} 