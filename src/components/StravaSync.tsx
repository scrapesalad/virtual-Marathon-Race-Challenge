'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';

interface StravaSyncProps {
  lastSync?: Date;
  activitiesCount?: number;
}

export function StravaSync({ lastSync, activitiesCount }: StravaSyncProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSync = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/strava/sync', {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to sync activities');
      }

      setSuccess('Activities synced successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync activities');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Strava Sync Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lastSync && (
          <div>
            <p className="text-sm text-gray-500">
              Last synced: {formatDistanceToNow(lastSync, { addSuffix: true })}
            </p>
            {activitiesCount !== undefined && (
              <p className="text-sm text-gray-500">
                {activitiesCount} activities synced
              </p>
            )}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleSync}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? <LoadingSpinner /> : 'Sync Now'}
        </Button>
      </CardContent>
    </Card>
  );
} 