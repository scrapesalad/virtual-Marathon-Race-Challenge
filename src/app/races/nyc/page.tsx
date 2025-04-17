import { Suspense } from 'react';
import { MarathonMap } from '@/components/races/MarathonMap';
import { nycMarathonRoute } from '@/data/nyc-marathon-route';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function NYCMarathonPage() {
  // In a real app, we would fetch the user's progress from the API
  const userProgress = 35; // Example progress

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{nycMarathonRoute.name}</h1>
            <p className="text-gray-500">{nycMarathonRoute.location}</p>
          </div>
          <Badge variant="outline" className="text-lg">
            {nycMarathonRoute.distance}km
          </Badge>
        </div>

        <Card>
          <CardContent className="p-6">
            <p className="text-gray-700">{nycMarathonRoute.description}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Race Details</h2>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-gray-500">Elevation Gain</dt>
                  <dd className="text-lg font-medium">{nycMarathonRoute.elevationGain}m</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Difficulty</dt>
                  <dd className="text-lg font-medium capitalize">{nycMarathonRoute.difficulty}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Course Record</dt>
                  <dd className="text-lg font-medium">{nycMarathonRoute.courseRecord}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Suspense fallback={<div>Loading map...</div>}>
            <MarathonMap route={nycMarathonRoute} userProgress={userProgress} />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 