import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RaceInviteForm } from './RaceInviteForm';

interface Participant {
  id: string;
  name: string;
  avatar: string;
  status: 'registered' | 'in_progress' | 'finished' | 'dropped';
  joinedAt: string;
}

interface RaceParticipantsProps {
  raceId: string;
  isOrganizer?: boolean;
}

export function RaceParticipants({ raceId, isOrganizer = false }: RaceParticipantsProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchParticipants = async () => {
    try {
      const response = await fetch(`/api/races/${raceId}/participants`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch participants');
      }

      setParticipants(data);
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [raceId]);

  const getStatusBadgeColor = (status: Participant['status']) => {
    switch (status) {
      case 'registered':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'finished':
        return 'bg-green-100 text-green-800';
      case 'dropped':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Participants</h3>
        {isOrganizer && (
          <Button
            variant="secondary"
            onClick={() => setShowInviteForm(!showInviteForm)}
          >
            {showInviteForm ? 'Hide Invite Form' : 'Invite Participants'}
          </Button>
        )}
      </div>

      {showInviteForm && (
        <div className="mb-6">
          <RaceInviteForm
            raceId={raceId}
            onInviteSent={() => {
              setShowInviteForm(false);
              fetchParticipants();
            }}
          />
        </div>
      )}

      {isLoading ? (
        <p className="text-center py-4">Loading participants...</p>
      ) : participants.length === 0 ? (
        <p className="text-center py-4 text-gray-500">No participants yet</p>
      ) : (
        <div className="space-y-4">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium">{participant.name}</p>
                  <p className="text-sm text-gray-500">
                    Joined {new Date(participant.joinedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeColor(
                  participant.status
                )}`}
              >
                {participant.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
} 