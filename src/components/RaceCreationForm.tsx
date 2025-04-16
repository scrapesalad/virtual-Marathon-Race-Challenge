'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Map } from './Map';
import { marathonRoutes } from '@/data/marathon-routes';
import Image from 'next/image';

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

export function RaceCreationForm({ onSubmit, onCancel }: RaceCreationFormProps) {
  const [formData, setFormData] = useState<RaceData>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    type: 'solo',
    route: 'nyc-marathon',
    targetDistance: 42.2,
    isPrivate: false
  });

  const defaultRoute = marathonRoutes.find(route => route.id === 'nyc') || marathonRoutes[0];
  const [selectedRoute, setSelectedRoute] = useState({
    coordinates: defaultRoute.coordinates,
    progress: 0,
    imageUrl: defaultRoute.imageUrl
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
              <label className="block text-sm font-medium mb-1">Race Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                rows={3}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>

          {/* Race Type and Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Race Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="solo">Solo Race</option>
                <option value="group">Group Race</option>
                <option value="challenge">Challenge</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Target Distance (km)</label>
              <input
                type="number"
                name="targetDistance"
                value={formData.targetDistance}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                min="1"
                step="0.1"
                required
              />
            </div>
          </div>

          {/* Route Selection */}
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700">Route</span>
              <select
                name="route"
                value={formData.route}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                {marathonRoutes.map(route => (
                  <option key={route.id} value={route.id}>
                    {route.name}
                  </option>
                ))}
              </select>
            </label>

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
                  progress={0}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={(e) => setFormData(prev => ({ ...prev, isPrivate: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <label className="text-sm">Make this race private</label>
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