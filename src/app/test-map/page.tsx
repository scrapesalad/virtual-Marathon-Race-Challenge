"use client";

import React, { useState, useEffect } from 'react';
import { Map } from '@/components/Map';

// NYC Marathon route coordinates (simplified version)
const nycMarathonCoordinates = [
  { lat: 40.6027, lng: -74.0545 }, // Start - Staten Island
  { lat: 40.6352, lng: -74.0245 }, // Brooklyn
  { lat: 40.6782, lng: -73.9442 }, // Williamsburg
  { lat: 40.7214, lng: -73.9612 }, // Long Island City
  { lat: 40.7829, lng: -73.9654 }, // Central Park South
  { lat: 40.7732, lng: -73.9722 }  // Finish - Central Park
];

export default function TestMapPage() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev + 1) % 101);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">NYC Marathon Progress Test</h1>
      <div className="mb-4">
        Progress: {progress}%
      </div>
      <Map 
        coordinates={nycMarathonCoordinates}
        progress={progress}
      />
    </div>
  );
} 