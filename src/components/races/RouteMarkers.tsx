'use client';

import { useState } from 'react';
import { Map } from '../Map';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Loader2, MapPin, X } from 'lucide-react';

type MarkerType = 'funny' | 'scary' | 'interesting' | 'warning';

interface Marker {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  type: MarkerType;
  createdAt: string;
}

interface RouteMarkersProps {
  raceId: string;
  initialMarkers?: Marker[];
  onMarkerAdd?: (marker: Marker) => void;
  onMarkerRemove?: (markerId: string) => void;
}

export function RouteMarkers({ raceId, initialMarkers = [], onMarkerAdd, onMarkerRemove }: RouteMarkersProps) {
  const [markers, setMarkers] = useState<Marker[]>(initialMarkers);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [newMarker, setNewMarker] = useState({
    title: '',
    description: '',
    type: 'interesting' as MarkerType,
  });
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMapClick = (coordinates: [number, number]) => {
    setSelectedLocation(coordinates);
    setIsAddingMarker(true);
  };

  const handleAddMarker = async () => {
    if (!selectedLocation || !newMarker.title) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/races/${raceId}/markers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newMarker,
          latitude: selectedLocation[0],
          longitude: selectedLocation[1],
        }),
      });

      if (!response.ok) throw new Error('Failed to add marker');

      const marker = await response.json();
      setMarkers(prev => [...prev, marker]);
      onMarkerAdd?.(marker);
      setIsAddingMarker(false);
      setNewMarker({ title: '', description: '', type: 'interesting' });
      setSelectedLocation(null);
    } catch (error) {
      console.error('Error adding marker:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMarker = async (markerId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/races/${raceId}/markers/${markerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove marker');

      setMarkers(prev => prev.filter(m => m.id !== markerId));
      onMarkerRemove?.(markerId);
    } catch (error) {
      console.error('Error removing marker:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMarkerColor = (type: MarkerType) => {
    switch (type) {
      case 'funny':
        return 'bg-yellow-500';
      case 'scary':
        return 'bg-red-500';
      case 'warning':
        return 'bg-orange-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Route Markers</h3>
          <p className="text-sm text-gray-500">
            Click on the map to add markers for interesting points along the route
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] mb-4">
            <Map
              coordinates={markers.map(m => [m.latitude, m.longitude])}
              onClick={handleMapClick}
              markers={markers.map(m => ({
                coordinates: [m.latitude, m.longitude],
                title: m.title,
                description: m.description,
                type: m.type,
              }))}
            />
          </div>

          {isAddingMarker && (
            <Card className="mb-4">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    value={newMarker.title}
                    onChange={(e) => setNewMarker(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="What's interesting here?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Input
                    value={newMarker.description}
                    onChange={(e) => setNewMarker(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Add more details..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={newMarker.type}
                    onChange={(e) => setNewMarker(prev => ({ ...prev, type: e.target.value as MarkerType }))}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="funny">Funny</option>
                    <option value="scary">Scary</option>
                    <option value="interesting">Interesting</option>
                    <option value="warning">Warning</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddMarker}
                    disabled={isLoading || !newMarker.title}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Marker'
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingMarker(false);
                      setSelectedLocation(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            {markers.map((marker) => (
              <div
                key={marker.id}
                className="flex items-start justify-between p-3 border rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full ${getMarkerColor(marker.type)} flex items-center justify-center`}>
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">{marker.title}</h4>
                    <p className="text-sm text-gray-500">{marker.description}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(marker.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMarker(marker.id)}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 