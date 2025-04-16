import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Map } from '@/components/Map';

interface RaceProgressUpdate {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  distance: number;
  currentLocation: [number, number];
  timestamp: string;
  pace?: number;
  heartRate?: number;
}

interface RaceProgressProps {
  currentDistance: number;
  totalDistance: number;
  currentPace: string;
  estimatedFinishTime: string;
  position: number;
  totalParticipants: number;
  timeLeft: string;
}

export function RaceProgress({
  currentDistance,
  totalDistance,
  currentPace,
  estimatedFinishTime,
  position,
  totalParticipants,
  timeLeft,
}: RaceProgressProps) {
  const progress = (currentDistance / totalDistance) * 100;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Race Progress</h3>
      
      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Distance</p>
          <p className="font-semibold">{currentDistance.toFixed(2)} / {totalDistance.toFixed(2)} km</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Current Pace</p>
          <p className="font-semibold">{currentPace}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Position</p>
          <p className="font-semibold">{position} / {totalParticipants}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Time Left</p>
          <p className="font-semibold">{timeLeft}</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-gray-500">Estimated Finish</p>
          <p className="font-semibold">{estimatedFinishTime}</p>
        </div>
      </div>
    </div>
  );
} 