'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';

interface RaceFormProps {
  initialData?: {
    id?: string;
    name: string;
    description: string;
    location: string;
    distance: number;
    elevationGain: number;
    difficulty: string;
    startDate: string;
    endDate: string;
    route: {
      coordinates: [number, number][];
    };
  };
}

export function RaceForm({ initialData }: RaceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    location: initialData?.location || '',
    distance: initialData?.distance || 0,
    elevationGain: initialData?.elevationGain || 0,
    difficulty: initialData?.difficulty || 'moderate',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = initialData?.id 
        ? `/api/races/${initialData.id}`
        : '/api/races';
      
      const response = await fetch(url, {
        method: initialData?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save race');
      }

      router.push('/races');
      router.refresh();
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
        ? parseFloat(value) 
        : value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">
          {initialData?.id ? 'Edit Race' : 'Create New Race'}
        </h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Race Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="text-black"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="text-black"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="text-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
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

              <div>
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

            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                required
                className="text-black"
              >
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="challenging">Challenging</option>
                <option value="difficult">Difficult</option>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
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

              <div>
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

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Race'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/races')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 