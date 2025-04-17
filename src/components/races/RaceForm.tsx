'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Textarea } from '@/components/ui/Textarea';
import { Map } from '@/components/Map';
import { marathonRoutes } from '@/data/marathon-routes';

interface RaceFormProps {
  initialData?: {
    id?: string;
    name: string;
    description: string;
    location: string;
    distance: number;
    elevationGain: number;
    difficulty: 'easy' | 'moderate' | 'challenging' | 'difficult';
    startDate: string;
    endDate: string;
    route: {
      id: string;
      coordinates: [number, number][];
    };
  };
}

export function RaceForm({ initialData }: RaceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const defaultRoute = marathonRoutes.find(route => route.id === initialData?.route?.id) || marathonRoutes[0];
  const [selectedRoute, setSelectedRoute] = useState({
    id: defaultRoute.id,
    coordinates: defaultRoute.coordinates,
    imageUrl: defaultRoute.imageUrl
  });

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    location: initialData?.location || '',
    distance: initialData?.distance || defaultRoute.distance,
    elevationGain: initialData?.elevationGain || defaultRoute.elevationGain,
    difficulty: initialData?.difficulty || defaultRoute.difficulty,
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    routeId: defaultRoute.id
  });

  const validateForm = () => {
    if (formData.name.length < 3) {
      setError('Race name must be at least 3 characters long');
      return false;
    }
    if (formData.description.length < 10) {
      setError('Description must be at least 10 characters long');
      return false;
    }
    if (formData.distance <= 0) {
      setError('Distance must be greater than 0');
      return false;
    }
    if (formData.elevationGain < 0) {
      setError('Elevation gain cannot be negative');
      return false;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError('Start date cannot be after end date');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const url = initialData?.id 
        ? `/api/races/${initialData.id}`
        : '/api/races';
      
      const response = await fetch(url, {
        method: initialData?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          route: {
            id: selectedRoute.id,
            coordinates: selectedRoute.coordinates
          }
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save race');
      }

      setSuccess('Race saved successfully! Redirecting...');
      setTimeout(() => {
        router.push('/races');
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save race');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'distance' || name === 'elevationGain' 
        ? parseFloat(value) || 0
        : value
    }));

    // Update selected route when route changes
    if (name === 'routeId') {
      const route = marathonRoutes.find(r => r.id === value) || defaultRoute;
      setSelectedRoute({
        id: route.id,
        coordinates: route.coordinates,
        imageUrl: route.imageUrl
      });
      setFormData(prev => ({
        ...prev,
        distance: route.distance,
        elevationGain: route.elevationGain,
        difficulty: route.difficulty
      }));
    }

    setError(null);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold tracking-tight">
          {initialData?.id ? 'Edit Race' : 'Create New Race'}
        </h2>
        <CardDescription>
          {initialData?.id 
            ? 'Update the details of your existing race'
            : 'Fill in the details to create a new virtual race'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Information */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Race Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., New York City Marathon"
                  required
                  className="text-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the race, its history, and what makes it special..."
                  required
                  className="min-h-[100px] text-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., New York City, USA"
                  required
                  className="text-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="text-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="text-black"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Route Selection and Preview */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="routeId">Select Route</Label>
                <select
                  id="routeId"
                  name="routeId"
                  value={formData.routeId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  {marathonRoutes.map(route => (
                    <option key={route.id} value={route.id}>
                      {route.name} - {route.distance}km, {route.elevationGain}m elevation
                    </option>
                  ))}
                </select>
              </div>

              {selectedRoute.imageUrl && (
                <div className="relative h-[200px] rounded-lg overflow-hidden">
                  <Image
                    src={selectedRoute.imageUrl}
                    alt="Selected marathon route"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}

              <div className="h-[300px] rounded-lg overflow-hidden">
                <Map 
                  coordinates={selectedRoute.coordinates}
                  className="w-full h-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input
                    id="distance"
                    name="distance"
                    type="number"
                    value={formData.distance}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.1"
                    className="text-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="elevationGain">Elevation Gain (m)</Label>
                  <Input
                    id="elevationGain"
                    name="elevationGain"
                    type="number"
                    value={formData.elevationGain}
                    onChange={handleChange}
                    required
                    min="0"
                    className="text-black"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="easy">Easy - Suitable for beginners</option>
                  <option value="moderate">Moderate - Some challenges</option>
                  <option value="challenging">Challenging - Experienced runners</option>
                  <option value="difficult">Difficult - Elite level</option>
                </select>
              </div>
            </div>
          </div>

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

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner className="w-4 h-4" />
                  Saving...
                </>
              ) : (
                'Save Race'
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/races')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 