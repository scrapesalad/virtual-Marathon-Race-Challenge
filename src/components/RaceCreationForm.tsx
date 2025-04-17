'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Map } from './Map';
import { marathonRoutes } from '@/data/marathon-routes';
import Image from 'next/image';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';

interface RaceCreationFormProps {
  onSubmit: (raceData: RaceData) => void;
  onCancel: () => void;
}

interface RaceData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  type: 'solo' | 'group' | 'challenge';
  route: string;
  targetDistance: number;
  participantLimit?: number;
  isPrivate: boolean;
}

interface RoutePreview {
  coordinates: [number, number][];
  progress: number;
  imageUrl?: string;
}

export function RaceCreationForm({ onSubmit, onCancel }: RaceCreationFormProps) {
  const defaultRoute = marathonRoutes.find(route => route.id === 'nyc') || marathonRoutes[0];
  
  const [formData, setFormData] = useState<RaceData>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    type: 'solo',
    route: defaultRoute.id,
    targetDistance: defaultRoute.distance,
    isPrivate: false
  });

  const [selectedRoute, setSelectedRoute] = useState<RoutePreview>({
    coordinates: defaultRoute.coordinates,
    progress: 0,
    imageUrl: defaultRoute.imageUrl
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));

    // Update selected route when route changes
    if (name === 'route') {
      const route = marathonRoutes.find(r => r.id === value) || defaultRoute;
      setSelectedRoute({
        coordinates: route.coordinates,
        progress: 0,
        imageUrl: route.imageUrl
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <CardHeader>
          <h2 className="text-2xl font-bold">Create a New Virtual Race</h2>
          <p className="text-gray-500">Set up your race parameters and invite participants</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Race Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter race name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your race"
                rows={3}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Race Type and Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Race Type</Label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="solo">Solo Race</option>
                <option value="group">Group Race</option>
                <option value="challenge">Challenge</option>
              </select>
            </div>
            <div>
              <Label htmlFor="targetDistance">Target Distance (km)</Label>
              <Input
                id="targetDistance"
                name="targetDistance"
                type="number"
                value={formData.targetDistance}
                onChange={handleInputChange}
                min="1"
                step="0.1"
                required
              />
            </div>
          </div>

          {/* Route Selection */}
          <div className="space-y-4">
            <Label htmlFor="route">Route</Label>
            <select
              id="route"
              name="route"
              value={formData.route}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            >
              {marathonRoutes.map(route => (
                <option key={route.id} value={route.id}>
                  {route.name}
                </option>
              ))}
            </select>

            {/* Route Preview */}
            <div className="rounded-lg overflow-hidden">
              {selectedRoute.imageUrl && (
                <div className="relative h-[200px] mb-4">
                  <Image
                    src={selectedRoute.imageUrl}
                    alt="Selected marathon route"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
              <div className="h-[300px]">
                <Map 
                  coordinates={selectedRoute.coordinates}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPrivate"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={(e) => setFormData(prev => ({ ...prev, isPrivate: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <Label htmlFor="isPrivate">Make this race private</Label>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-4">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Create Race
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 