'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { DynamicMap } from '@/components/DynamicMap';
import { getMarathonRouteById } from '@/data/marathon-routes';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { bostonMarathon } from '@/data/races';

// Get Boston Marathon data
const bostonMarathonData = getMarathonRouteById('boston');

// Import the image directly
import bostonMarathonImage from '../../../../public/images/boston-marathon.jpg';

interface Milestone {
  distance: number;
  location: string;
  description: string;
}

const BOSTON_MILESTONES: Milestone[] = [
  { distance: 0, location: "Hopkinton", description: "Race start" },
  { distance: 6.5, location: "Framingham", description: "First major town" },
  { distance: 12.8, location: "Wellesley College", description: "Famous 'Scream Tunnel'" },
  { distance: 20.5, location: "Heartbreak Hill", description: "Challenging uphill section" },
  { distance: 24.5, location: "Coolidge Corner", description: "Enter Brookline" },
  { distance: 42.2, location: "Boylston Street", description: "Iconic finish line" }
];

export default function BostonMarathonPage() {
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
        body: JSON.stringify({ raceId: bostonMarathon.id }),
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

  if (!bostonMarathonData) return null;

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
            src={bostonMarathonImage}
            alt="Boston Marathon runners with American flags"
            fill
            style={{ objectFit: 'cover' }}
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{bostonMarathonData.name}</h1>
            <p className="text-xl opacity-90">{bostonMarathonData.location}</p>
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
                  <Badge variant={bostonMarathonData.difficulty === 'challenging' ? 'warning' : 'default'}>
                    {bostonMarathonData.difficulty}
                  </Badge>
                </div>
                <p className="text-gray-600">{bostonMarathonData.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Distance</p>
                    <p className="font-semibold">{bostonMarathonData.distance} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Elevation Gain</p>
                    <p className="font-semibold">{bostonMarathonData.elevationGain}m</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Course Record</p>
                    <p className="font-semibold">{bostonMarathonData.courseRecord}</p>
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
                  {BOSTON_MILESTONES.map((milestone: Milestone) => (
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
                  <DynamicMap coordinates={bostonMarathonData.coordinates} progress={progress} className="w-full h-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 