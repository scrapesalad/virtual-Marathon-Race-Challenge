'use client';

import { Card, CardContent } from '@/components/ui/Card';
import Image from 'next/image';

interface SimpleRaceMapProps {
  progress: number; // Progress as a percentage (0-100)
  raceName: string;
}

export function SimpleRaceMap({ progress, raceName }: SimpleRaceMapProps) {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative h-80 w-full overflow-hidden">
          {/* Race route image */}
          <div className="absolute inset-0">
            <Image
              src="/images/nyc-marathon-route.svg"
              alt={`${raceName} route`}
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
          
          {/* Progress overlay */}
          <div 
            className="absolute inset-0 bg-orange-500/20"
            style={{ 
              clipPath: `polygon(0 0, ${clampedProgress}% 0, ${clampedProgress}% 100%, 0 100%)` 
            }}
          />
          
          {/* Progress marker */}
          <div 
            className="absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-orange-500 shadow-lg"
            style={{ left: `${clampedProgress}%` }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white">
              {clampedProgress.toFixed(1)}%
            </div>
          </div>
          
          {/* Start and finish markers */}
          <div className="absolute bottom-4 left-4 rounded bg-white/90 px-2 py-1 text-xs font-medium shadow">
            Start
          </div>
          <div className="absolute bottom-4 right-4 rounded bg-white/90 px-2 py-1 text-xs font-medium shadow">
            Finish
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 