'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DynamicMap } from '@/components/DynamicMap';
import { MapRoute } from '@/types/route';
import { MarathonRecord } from '@/components/races/MarathonRecord';
import Image from 'next/image';

interface RaceDetailsProps {
  race: {
    id: string;
    name: string;
    description: string;
    location: string;
    distance: number;
    elevationGain: number;
    difficulty: string;
    startDate: string;
    endDate: string;
    courseRecord?: string;
    recordHolder?: string;
    recordYear?: number;
    route: {
      coordinates: [number, number][];
    };
    participants: {
      user: {
        id: string;
        name: string;
        image: string | null;
      };
    }[];
  };
}

export function RaceDetails({ race }: RaceDetailsProps) {
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState<number>(0);
  const [progress, setProgress] = useState(0);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'success';
      case 'moderate':
        return 'default';
      case 'challenging':
        return 'warning';
      case 'difficult':
        return 'error';
      default:
        return 'default';
    }
  };

  const mapRoute: MapRoute = {
    coordinates: race.route.coordinates,
    progress: progress
  };

  const handleJoinRace = async () => {
    try {
      const response = await fetch('/api/races/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raceId: race.id }),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to join race');
      }
    } catch (error) {
      console.error('Error joining race:', error);
      alert('Failed to join race. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{race.name}</h1>
        <Link href="/races">
          <Button variant="secondary">Back to Races</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="text-gray-600 mb-4">{race.location}</p>
          
          <div className="flex gap-2 mb-4">
            <Badge variant={getDifficultyColor(race.difficulty)}>
              {race.difficulty.charAt(0).toUpperCase() + race.difficulty.slice(1)}
            </Badge>
            <Badge variant="default">
              {race.distance} km
            </Badge>
            <Badge variant="default">
              {race.elevationGain}m elevation
            </Badge>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold">Race Details</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{race.description}</p>
              {race.courseRecord && race.recordHolder && race.recordYear && (
                <div className="mb-4">
                  <MarathonRecord
                    courseRecord={race.courseRecord}
                    recordHolder={race.recordHolder}
                    recordYear={race.recordYear}
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-semibold">{new Date(race.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="font-semibold">{new Date(race.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold">Participants</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {race.participants.map((participant) => (
                  <Link 
                    key={participant.user.id} 
                    href={`/profile/${participant.user.id}`}
                    className="block hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        {participant.user.image ? (
                          <Image
                            src={participant.user.image}
                            alt={participant.user.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">
                              {participant.user.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{participant.user.name}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button 
              variant="primary" 
              onClick={handleJoinRace}
            >
              Join Race
            </Button>
            <Link href={`/races/${race.id}/course`}>
              <Button variant="secondary">View Course Details</Button>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="h-[600px] bg-gray-100 rounded-lg overflow-hidden">
            <DynamicMap 
              coordinates={race.route.coordinates}
              progress={progress}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 