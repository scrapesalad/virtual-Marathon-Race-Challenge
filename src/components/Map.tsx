"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { RaceAvatar } from './RaceAvatar';
import type { Map as MapboxMap } from 'mapbox-gl';

interface SponsorCheckpoint {
  id: number;
  distance: number;
  name: string;
  sponsor: string;
  icon: string;
  coordinates: [number, number];
}

interface Point {
  name: string;
  description: string;
  coordinates: [number, number];
}

// Default coordinates (Salt Lake City - Liberty Park to Downtown)
const DEFAULT_COORDINATES: [number, number][] = [
  [-111.8745, 40.7500], // Liberty Park
  [-111.8867, 40.7608]  // Downtown SLC
];

// Example sponsor checkpoints - in real app, this would come from your database
const SPONSOR_CHECKPOINTS = [
  {
    id: 1,
    position: 25, // percentage along the route
    name: "Hydration Station",
    sponsor: "Gatorade",
    icon: "🥤"
  },
  {
    id: 2,
    position: 50,
    name: "Energy Boost",
    sponsor: "Clif Bar",
    icon: "🍫"
  },
  {
    id: 3,
    position: 75,
    name: "Recovery Zone",
    sponsor: "Nike",
    icon: "👟"
  }
];

interface MapProps {
  coordinates?: [number, number][]; // [longitude, latitude]
  progress?: number;
  className?: string;
  sponsorCheckpoints?: SponsorCheckpoint[];
  startPoint?: Point;
  finishPoint?: Point;
}

export function Map({ 
  coordinates = DEFAULT_COORDINATES,
  progress = 0, 
  className = '',
  sponsorCheckpoints = [],
  startPoint,
  finishPoint
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapboxMap | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapboxgl, setMapboxgl] = useState<any>(null);
  const markersRef = useRef<{
    progress: any | null;
    start: any | null;
    finish: any | null;
    sponsors: any[];
  }>({
    progress: null,
    start: null,
    finish: null,
    sponsors: []
  });
  const routeSourcesAdded = useRef(false);

  // Load Mapbox GL JS
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('mapbox-gl').then((mapboxgl) => {
        mapboxgl.default.accessToken = 'pk.eyJ1Ijoic2FsdHlzdGVleiIsImEiOiJjbTk4M3RkemIwYXAzMndweTduN3d4enExIn0.U7zJz3R2Zd-v04HtDlWBGw';
        setMapboxgl(mapboxgl.default);
      });
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxgl || map.current) return;

    const initializeMap = async () => {
      try {
        const coords = coordinates || DEFAULT_COORDINATES;
        const bounds = new mapboxgl.LngLatBounds();
        coords.forEach(([lng, lat]) => bounds.extend([lng, lat]));
        sponsorCheckpoints.forEach(checkpoint => bounds.extend(checkpoint.coordinates));

        const newMap = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/outdoors-v12',
          bounds: bounds,
          fitBoundsOptions: { padding: 50 },
          pitch: 45,
          antialias: true
        });

        map.current = newMap;

        // Wait for map to load before proceeding
        await new Promise<void>((resolve) => {
          newMap.once('load', () => {
            resolve();
          });
        });

        // Add navigation control
        newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add terrain
        newMap.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
          'maxzoom': 14
        });

        newMap.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

        // Add sky
        newMap.addLayer({
          'id': 'sky',
          'type': 'sky',
          'paint': {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 90.0],
            'sky-atmosphere-sun-intensity': 15
          }
        });

        // Add route sources
        newMap.addSource('route-full', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        });

        newMap.addSource('route-completed', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: []
            }
          }
        });

        // Add route layers
        newMap.addLayer({
          id: 'route-full',
          type: 'line',
          source: 'route-full',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#94a3b8',
            'line-width': 4,
            'line-dasharray': [2, 2]
          }
        });

        newMap.addLayer({
          id: 'route-completed',
          type: 'line',
          source: 'route-completed',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 4
          }
        });

        routeSourcesAdded.current = true;
        setMapLoaded(true);
        
        // Add markers after map is fully loaded
        updateMarkers(newMap);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    return () => {
      if (map.current) {
        if (markersRef.current.progress) markersRef.current.progress.remove();
        if (markersRef.current.start) markersRef.current.start.remove();
        if (markersRef.current.finish) markersRef.current.finish.remove();
        markersRef.current.sponsors.forEach(marker => marker.remove());
        markersRef.current = { progress: null, start: null, finish: null, sponsors: [] };
        map.current.remove();
        map.current = null;
      }
      setMapLoaded(false);
      routeSourcesAdded.current = false;
    };
  }, [mapboxgl, coordinates, sponsorCheckpoints]);

  // Update markers function
  const updateMarkers = useCallback((mapInstance: MapboxMap) => {
    if (!mapboxgl) return;

    // Clear existing markers
    if (markersRef.current.start) markersRef.current.start.remove();
    if (markersRef.current.finish) markersRef.current.finish.remove();
    markersRef.current.sponsors.forEach(marker => marker.remove());
    markersRef.current = { ...markersRef.current, start: null, finish: null, sponsors: [] };

    // Add start marker
    if (startPoint) {
      const el = document.createElement('div');
      el.className = 'start-marker';
      el.innerHTML = `<div class="w-8 h-8 bg-green-500 rounded-full shadow-lg flex items-center justify-center text-white font-bold">S</div>`;
      
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-bold">${startPoint.name}</h3>
            <p class="text-sm">${startPoint.description}</p>
          </div>
        `);

      markersRef.current.start = new mapboxgl.Marker(el)
        .setLngLat(startPoint.coordinates)
        .setPopup(popup)
        .addTo(mapInstance);
    }

    // Add finish marker
    if (finishPoint) {
      const el = document.createElement('div');
      el.className = 'finish-marker';
      el.innerHTML = `<div class="w-8 h-8 bg-red-500 rounded-full shadow-lg flex items-center justify-center text-white font-bold">F</div>`;
      
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-bold">${finishPoint.name}</h3>
            <p class="text-sm">${finishPoint.description}</p>
          </div>
        `);

      markersRef.current.finish = new mapboxgl.Marker(el)
        .setLngLat(finishPoint.coordinates)
        .setPopup(popup)
        .addTo(mapInstance);
    }

    // Add sponsor checkpoints
    sponsorCheckpoints.forEach(checkpoint => {
      const el = document.createElement('div');
      el.className = 'sponsor-checkpoint';
      el.innerHTML = `
        <div class="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-xl">
          ${checkpoint.icon}
        </div>
      `;
      
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-bold">${checkpoint.name}</h3>
            <p class="text-sm">Sponsored by ${checkpoint.sponsor}</p>
            <p class="text-sm font-semibold mt-1">${checkpoint.distance} km</p>
          </div>
        `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat(checkpoint.coordinates)
        .setPopup(popup)
        .addTo(mapInstance);
      
      markersRef.current.sponsors.push(marker);
    });
  }, [mapboxgl, startPoint, finishPoint, sponsorCheckpoints]);

  // Update progress
  useEffect(() => {
    if (!mapLoaded || !map.current || !mapboxgl) return;

    const progressPoint = calculateProgressPoint(progress);
    updateProgressMarker(progressPoint);
    updateCompletedRoute(progress);
  }, [progress, mapLoaded, mapboxgl]);

  const calculateProgressPoint = useCallback((progress: number): [number, number] => {
    if (!coordinates.length) return coordinates[0];
    if (progress >= 100) return coordinates[coordinates.length - 1];
    if (progress <= 0) return coordinates[0];
    
    const totalDistance = calculateTotalDistance();
    const targetDistance = totalDistance * (progress / 100);
    let coveredDistance = 0;

    for (let i = 0; i < coordinates.length - 1; i++) {
      const segmentDistance = calculateDistance(coordinates[i], coordinates[i + 1]);
      if (coveredDistance + segmentDistance >= targetDistance) {
        const remaining = targetDistance - coveredDistance;
        const ratio = remaining / segmentDistance;
        return [
          coordinates[i][0] + (coordinates[i + 1][0] - coordinates[i][0]) * ratio,
          coordinates[i][1] + (coordinates[i + 1][1] - coordinates[i][1]) * ratio
        ];
      }
      coveredDistance += segmentDistance;
    }

    return coordinates[coordinates.length - 1];
  }, [coordinates]);

  const updateProgressMarker = useCallback((position: [number, number]) => {
    if (!map.current || !mapboxgl) return;

    if (!markersRef.current.progress) {
      const el = document.createElement('div');
      el.className = 'progress-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#3b82f6';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.5)';

      markersRef.current.progress = new mapboxgl.Marker(el)
        .setLngLat(position)
        .addTo(map.current);
    } else {
      markersRef.current.progress.setLngLat(position);
    }
  }, [mapboxgl]);

  const updateCompletedRoute = useCallback((progress: number) => {
    if (!map.current) return;

    const progressPoint = calculateProgressPoint(progress);
    const completedCoords = [];
    let foundProgressPoint = false;

    for (const coord of coordinates) {
      completedCoords.push(coord);
      if (coord[0] === progressPoint[0] && coord[1] === progressPoint[1]) {
        foundProgressPoint = true;
        break;
      }
    }

    if (!foundProgressPoint && completedCoords.length > 0) {
      completedCoords.push(progressPoint);
    }

    const source = map.current.getSource('route-completed') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: completedCoords
        }
      });
    }
  }, [calculateProgressPoint, coordinates]);

  const calculateDistance = useCallback((coord1: [number, number], coord2: [number, number]): number => {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
    
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }, []);

  const calculateTotalDistance = useCallback((): number => {
    if (coordinates.length < 2) return 0;
    
    let total = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
      total += calculateDistance(coordinates[i], coordinates[i + 1]);
    }
    return total;
  }, [coordinates, calculateDistance]);

  return (
    <div 
      ref={mapContainer} 
      className={`relative w-full h-[400px] rounded-lg overflow-hidden ${className}`}
    />
  );
}