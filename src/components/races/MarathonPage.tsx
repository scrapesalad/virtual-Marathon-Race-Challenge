'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { DynamicMap } from '@/components/DynamicMap';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface Milestone {
  distance: number;
  location: string;
  description: string;
}

interface MarathonData {
  id: string;
  name: string;
  description: string;
  location: string;
  distance: number;
  elevationGain: number;
  difficulty: string;
  coordinates: [number, number][];
  milestones: Milestone[];
  image: string;
}

interface MarathonPageProps {
  marathon: MarathonData;
}

export function MarathonPage({ marathon }: MarathonPageProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinRace = async () => {
    try {
      setIsJoining(true);
      const response = await fetch('/api/races/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raceId: marathon.id }),
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
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/races">
            <Button variant="secondary">← Back to Races</Button>
          </Link>
        </div>

        {/* Hero Section with Image */}
        <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
          <Image
            src={marathon.image}
            alt={`${marathon.name} runners`}
            fill
            style={{ objectFit: 'cover' }}
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{marathon.name}</h1>
            <p className="text-xl opacity-90">{marathon.location}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            {/* Race Details */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Race Details</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge variant={marathon.difficulty === 'challenging' ? 'warning' : 'default'}>
                    {marathon.difficulty}
                  </Badge>
                </div>
                <p className="text-gray-600">{marathon.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Distance</p>
                    <p className="font-semibold">{marathon.distance} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Elevation Gain</p>
                    <p className="font-semibold">{marathon.elevationGain}m</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Milestones */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Course Milestones</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marathon.milestones.map((milestone) => (
                    <div 
                      key={milestone.location}
                      className="flex items-start gap-4"
                    >
                      <div className="w-16 text-right">
                        <span className="font-semibold">{milestone.distance} km</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{milestone.location}</h3>
                        <p className="text-sm text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button 
                variant="primary" 
                onClick={handleJoinRace}
                disabled={isJoining}
              >
                {isJoining ? 'Registering...' : 'Register Now'}
              </Button>
              <Button variant="secondary">View Training Plan</Button>
            </div>
          </div>

          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="h-[600px] rounded-lg overflow-hidden">
                  <DynamicMap coordinates={marathon.coordinates} progress={progress} className="w-full h-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 