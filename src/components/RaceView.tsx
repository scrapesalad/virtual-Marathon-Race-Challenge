'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RaceProgress } from './RaceProgress';
import { RaceStats } from './RaceStats';
import { Map } from './Map';
import { motion } from 'framer-motion';

// Example NYC Marathon route coordinates (simplified)
const NYC_MARATHON_ROUTE: {
  coordinates: [number, number][];
  progress: number;
} = {
  coordinates: [
    [-74.0495, 40.6024], // Start - Staten Island
    [-73.9708, 40.6447], // Brooklyn
    [-73.9545, 40.7037], // Williamsburg
    [-73.9519, 40.7614], // Manhattan
    [-73.9339, 40.7934], // Harlem
    [-73.9507, 40.7744], // Central Park
    [-73.9747, 40.7686], // Finish Line
  ],
  progress: 35, // Example progress percentage
};

interface RaceViewProps {
  raceName: string;
  raceType: string;
  startDate: Date;
  endDate: Date;
  currentDistance: number;
  totalDistance: number;
  currentPace: string;
  estimatedFinishTime: string;
  position: number;
  totalParticipants: number;
  timeLeft: string;
  elevationGain: number;
  caloriesBurned: number;
  averageHeartRate: number;
  route: {
    coordinates: [number, number][];
  };
}

function RunningAvatar({ isActivelyRunning }: { isActivelyRunning: boolean }) {
  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg p-4 shadow-inner">
      <motion.div
        className="flex items-center justify-center"
        animate={{
          y: isActivelyRunning ? [-2, 2] : 0
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        <div className={`text-center ${isActivelyRunning ? 'scale-100' : 'scale-95 opacity-50'}`}>
          <motion.div
            animate={{
              rotate: isActivelyRunning ? [0, -10, 10, 0] : 0
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear"
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`w-12 h-12 ${isActivelyRunning ? 'text-blue-500' : 'text-gray-400'}`}
            >
              <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM20 12.5V23h-2v-9.5h-3.5V21h-2v-7.5h-3.5V23h-2V12.5c0-1.1.9-2 2-2h9c1.1 0 2 .9 2 2z"/>
            </svg>
          </motion.div>
          <div className="mt-2">
            <p className="font-medium text-sm">
              {isActivelyRunning ? 'Currently Running' : 'Not Active'}
            </p>
            <motion.div
              className="h-1 bg-blue-200 rounded-full mt-1 overflow-hidden"
              style={{ width: '100px', margin: '0 auto' }}
            >
              {isActivelyRunning && (
                <motion.div
                  className="h-full bg-blue-500"
                  animate={{
                    x: [-100, 100]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "linear"
                  }}
                />
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function RaceView({
  raceName,
  raceType,
  startDate,
  endDate,
  currentDistance,
  totalDistance,
  currentPace,
  estimatedFinishTime,
  position,
  totalParticipants,
  timeLeft,
  elevationGain,
  caloriesBurned,
  averageHeartRate,
  route,
}: RaceViewProps) {
  const [isActivelyRunning, setIsActivelyRunning] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const progress = (currentDistance / totalDistance) * 100;

  // Check if the user is actively running based on updates to currentDistance
  useEffect(() => {
    const now = new Date();
    
    if (lastUpdateTime) {
      // Consider the user active if there's been an update in the last 5 minutes
      const timeSinceLastUpdate = now.getTime() - lastUpdateTime.getTime();
      setIsActivelyRunning(timeSinceLastUpdate < 5 * 60 * 1000); // 5 minutes in milliseconds
    }
    
    setLastUpdateTime(now);
  }, [currentDistance]);

  // Format dates for display
  const formattedStartDate = startDate.toLocaleDateString();
  const formattedEndDate = endDate.toLocaleDateString();
  const showDateRange = formattedStartDate !== formattedEndDate;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{raceName}</h2>
            <p className="text-gray-500">
              {formattedStartDate}
              {showDateRange && ` - ${formattedEndDate}`}
            </p>
          </div>
          <Badge variant="default">{raceType}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Running Avatar */}
          <div className="md:col-span-1">
            <RunningAvatar isActivelyRunning={isActivelyRunning} />
          </div>
          
          {/* Race Stats */}
          <div className="md:col-span-2">
            <RaceProgress
              currentDistance={currentDistance}
              totalDistance={totalDistance}
              currentPace={currentPace}
              estimatedFinishTime={estimatedFinishTime}
              position={position}
              totalParticipants={totalParticipants}
              timeLeft={timeLeft}
            />
          </div>
        </div>

        {/* Map with progress */}
        <div className="h-[400px] rounded-lg overflow-hidden">
          <Map 
            coordinates={route.coordinates}
            progress={progress}
          />
        </div>

        <RaceStats
          elevationGain={elevationGain}
          caloriesBurned={caloriesBurned}
          averageHeartRate={averageHeartRate}
        />
      </CardContent>
    </Card>
  );
} 