'use client';

import React, { useState } from 'react';
import { MarathonRoute, getAllMarathonRoutes } from '@/data/marathon-routes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { StaticImageData } from 'next/image';

interface MarathonSelectorProps {
  onSelectMarathon: (marathon: MarathonRoute) => void;
  selectedMarathonId?: string;
}

// Update the Badge variant type
type BadgeVariant = 'default' | 'success' | 'warning' | 'error';

export const MarathonSelector: React.FC<MarathonSelectorProps> = ({
  onSelectMarathon,
  selectedMarathonId
}) => {
  const [marathons] = useState<MarathonRoute[]>(getAllMarathonRoutes());
  const [filter, setFilter] = useState<'all' | 'easy' | 'moderate' | 'challenging' | 'difficult'>('all');

  const filteredMarathons = filter === 'all' 
    ? marathons 
    : marathons.filter(m => m.difficulty === filter);

  const getDifficultyColor = (difficulty: MarathonRoute['difficulty']): BadgeVariant => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'moderate': return 'warning';
      case 'challenging': return 'error';
      case 'difficult': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">Available Marathons</h2>
        <p className="text-muted-foreground">
          Select a marathon to participate in virtually
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={filter === 'all' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'easy' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('easy')}
        >
          Easy
        </Button>
        <Button
          variant={filter === 'moderate' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('moderate')}
        >
          Moderate
        </Button>
        <Button
          variant={filter === 'challenging' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('challenging')}
        >
          Challenging
        </Button>
        <Button
          variant={filter === 'difficult' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('difficult')}
        >
          Difficult
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMarathons.map((marathon) => (
          <Card
            key={marathon.id}
            className={`overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] ${
              selectedMarathonId === marathon.id ? 'ring-2 ring-orange-500' : ''
            }`}
            onClick={() => onSelectMarathon(marathon)}
          >
            <div className="relative h-48 w-full">
              {marathon.imageUrl && (
                <Image
                  src={marathon.imageUrl}
                  alt={marathon.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{marathon.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{marathon.location}</p>
              <div className="flex gap-2 mb-3">
                <Badge variant={getDifficultyColor(marathon.difficulty)}>
                  {marathon.difficulty.charAt(0).toUpperCase() + marathon.difficulty.slice(1)}
                </Badge>
                <Badge variant="default">
                  {marathon.distance} km
                </Badge>
                <Badge variant="default">
                  {marathon.elevationGain}m gain
                </Badge>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{marathon.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {filteredMarathons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No marathons found for the selected difficulty level.</p>
        </div>
      )}
    </div>
  );
}; 