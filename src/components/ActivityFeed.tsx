'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getRuns, formatPace, formatTime } from '@/lib/strava';
import type { StravaActivity } from 'strava-v3';

interface ActivityFeedProps {
  accessToken: string;
}

export function ActivityFeed({ accessToken }: ActivityFeedProps) {
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivities() {
      try {
        setIsLoading(true);
        const runs = await getRuns(accessToken);
        setActivities(runs);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load activities');
      } finally {
        setIsLoading(false);
      }
    }

    if (accessToken) {
      fetchActivities();
    }
  }, [accessToken]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No activities found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activities</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 5).map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">{activity.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="default">
                    {(activity.distance / 1000).toFixed(2)} km
                  </Badge>
                  <Badge variant="default">
                    {formatPace(activity.moving_time / (activity.distance / 1000) / 60)}
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(activity.start_date_local).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatTime(activity.moving_time / 60)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Moving Time
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 