'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DynamicMap } from '@/components/DynamicMap';
import { getMarathonRouteById } from '@/data/marathon-routes';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

// Get Chicago Marathon data
const chicagoMarathon = getMarathonRouteById('chicago');

// Chicago Marathon specific milestones
const CHICAGO_MILESTONES = [
  { distance: 0, location: "Grant Park", description: "Race start" },
  { distance: 7.5, location: "Lincoln Park", description: "First major landmark" },
  { distance: 13, location: "Wrigleyville", description: "Historic baseball district" },
  { distance: 23, location: "Pilsen", description: "Vibrant cultural neighborhood" },
  { distance: 35, location: "Chinatown", description: "Iconic gate and community" },
  { distance: 42.2, location: "Grant Park", description: "Finish line celebration" }
];

// Chicago Marathon sponsor checkpoints
const CHICAGO_SPONSOR_CHECKPOINTS = [
  { distance: 5, name: "Nike Hydration Station", description: "First major hydration point" },
  { distance: 15, name: "Gatorade Energy Zone", description: "Electrolyte and energy supplements" },
  { distance: 25, name: "PowerBar Recovery Point", description: "Nutrition and recovery support" },
  { distance: 35, name: "Adidas Final Push", description: "Final sponsor checkpoint" }
];

export default function ChicagoMarathonPage() {
  const [progress, setProgress] = useState(0);

  if (!chicagoMarathon) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Race not found</h1>
        <p className="mb-4">The requested race could not be found.</p>
        <Link href="/races">
          <Button variant="secondary">Back to Races</Button>
        </Link>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative h-[400px] mb-8 rounded-lg overflow-hidden">
        <Image
          src={chicagoMarathon.imageUrl || '/images/default-race.jpg'}
          alt="Chicago Marathon"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-4xl font-bold text-white mb-2">{chicagoMarathon.name}</h1>
          <p className="text-xl text-white/90">{chicagoMarathon.location}</p>
        </div>
      </div>

      {/* Race Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Course Details</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><span className="font-medium">Distance:</span> {chicagoMarathon.distance} km</p>
              <p><span className="font-medium">Elevation Gain:</span> {chicagoMarathon.elevationGain} m</p>
              <p><span className="font-medium">Course Record:</span> {chicagoMarathon.courseRecord}</p>
              <Badge variant={getDifficultyColor(chicagoMarathon.difficulty)}>
                {chicagoMarathon.difficulty.charAt(0).toUpperCase() + chicagoMarathon.difficulty.slice(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Course Sections</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Start to Lincoln Park", distance: "0-7.5km" },
                { name: "North Side", distance: "7.5-13km" },
                { name: "West Side", distance: "13-23km" },
                { name: "South Side", distance: "23-35km" },
                { name: "Final Stretch", distance: "35-42.2km" }
              ].map((section, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{section.name}</span>
                  <Badge variant="outline">{section.distance}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Sponsor Checkpoints</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {CHICAGO_SPONSOR_CHECKPOINTS.map((checkpoint, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{checkpoint.name}</p>
                    <p className="text-sm text-gray-500">{checkpoint.description}</p>
                  </div>
                  <Badge variant="outline">{checkpoint.distance}km</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Section */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-semibold">Course Map</h2>
        </CardHeader>
        <CardContent>
          <div className="h-[500px]">
            <DynamicMap coordinates={chicagoMarathon.coordinates} progress={progress} className="w-full h-full" />
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
            {CHICAGO_MILESTONES.map((milestone, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{milestone.location}</p>
                  <p className="text-sm text-gray-500">{milestone.description}</p>
                </div>
                <Badge variant="outline">{milestone.distance}km</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Back Button */}
      <div className="mt-8">
        <Link href="/races">
          <Button variant="secondary">Back to Races</Button>
        </Link>
      </div>
    </div>
  );
} 