import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RaceParticipants } from './RaceParticipants';
import { RaceInviteForm } from './RaceInviteForm';
import { toast } from '@/components/ui/Toast';

interface Race {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  type: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  participantCount: number;
  route: {
    name: string;
    distance: number;
    elevationGain: number;
  };
}

interface RaceManagementProps {
  raceId: string;
}

export function RaceManagement({ raceId }: RaceManagementProps) {
  const [race, setRace] = useState<Race | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);

  const fetchRaceDetails = async () => {
    try {
      const response = await fetch(`/api/races/${raceId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch race details');
      }

      setRace(data);
    } catch (error) {
      console.error('Error fetching race details:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch race details',
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRaceDetails();
  }, [raceId]);

  const handleStatusChange = async (newStatus: Race['status']) => {
    try {
      const response = await fetch(`/api/races/${raceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update race status');
      }

      setRace(prev => prev ? { ...prev, status: newStatus } : null);
      toast({
        title: 'Success',
        description: 'Race status updated successfully',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error updating race status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update race status',
        variant: 'error',
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading race details...</div>;
  }

  if (!race) {
    return <div className="text-center py-8">Race not found</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{race.name}</h2>
            <p className="text-gray-600">
              {new Date(race.startDate).toLocaleDateString()} -{' '}
              {new Date(race.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className="space-x-2">
            {race.status === 'scheduled' && (
              <Button
                variant="primary"
                onClick={() => handleStatusChange('in_progress')}
              >
                Start Race
              </Button>
            )}
            {race.status === 'in_progress' && (
              <Button
                variant="primary"
                onClick={() => handleStatusChange('completed')}
              >
                End Race
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => setShowInviteForm(!showInviteForm)}
            >
              {showInviteForm ? 'Hide Invite Form' : 'Invite Participants'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p className="mt-1 text-lg font-semibold capitalize">
              {race.status.replace('_', ' ')}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Distance</h3>
            <p className="mt-1 text-lg font-semibold">
              {race.route.distance.toFixed(1)} km
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Elevation Gain</h3>
            <p className="mt-1 text-lg font-semibold">
              {race.route.elevationGain.toFixed(0)} m
            </p>
          </div>
        </div>

        {showInviteForm && (
          <div className="mb-6">
            <RaceInviteForm
              raceId={raceId}
              onInviteSent={() => {
                setShowInviteForm(false);
                fetchRaceDetails();
              }}
            />
          </div>
        )}
      </Card>

      <RaceParticipants raceId={raceId} isOrganizer={true} />
    </div>
  );
} 