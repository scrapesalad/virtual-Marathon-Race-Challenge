'use client';

import { useEffect, useState } from 'react';
import { DynamicMap } from '@/components/DynamicMap';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MarathonRoute } from '@/data/marathon-routes';

interface MarathonMapProps {
  route: MarathonRoute;
  userProgress: number; // Progress as a percentage (0-100)
  className?: string;
}

export function MarathonMap({ route, userProgress = 0, className = '' }: MarathonMapProps) {
  // Calculate user's current position on the route based on progress
  const [userPosition, setUserPosition] = useState<[number, number]>(route.coordinates[0]);

  useEffect(() => {
    if (userProgress <= 0) {
      setUserPosition(route.coordinates[0]);
      return;
    }
    if (userProgress >= 100) {
      setUserPosition(route.coordinates[route.coordinates.length - 1]);
      return;
    }

    // Calculate the position along the route based on progress
    const totalSegments = route.coordinates.length - 1;
    const progressIndex = (userProgress / 100) * totalSegments;
    const segmentIndex = Math.floor(progressIndex);
    const segmentProgress = progressIndex - segmentIndex;

    if (segmentIndex >= totalSegments) {
      setUserPosition(route.coordinates[totalSegments]);
      return;
    }

    // Interpolate between two points
    const start = route.coordinates[segmentIndex];
    const end = route.coordinates[segmentIndex + 1];
    const interpolatedPosition: [number, number] = [
      start[0] + (end[0] - start[0]) * segmentProgress,
      start[1] + (end[1] - start[1]) * segmentProgress
    ];

    setUserPosition(interpolatedPosition);
  }, [userProgress, route.coordinates]);

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{route.name} Progress</h3>
          <Badge variant="secondary">{userProgress.toFixed(1)}% Complete</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] rounded-lg overflow-hidden">
          <DynamicMap
            coordinates={route.coordinates}
            markers={[
              {
                coordinates: userPosition,
                title: 'Your Position',
                description: `${userProgress.toFixed(1)}% Complete`,
                type: 'interesting'
              }
            ]}
            className="w-full h-full"
          />
        </div>
      </CardContent>
    </Card>
  );
} 