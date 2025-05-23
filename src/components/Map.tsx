"use client";

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { cn } from '@/lib/utils';

interface Point {
  latitude: number;
  longitude: number;
}

interface MapProps {
  coordinates: [number, number][];
  onClick?: (coordinates: [number, number]) => void;
  markers?: {
    coordinates: [number, number];
    title: string;
    description: string;
    type: 'funny' | 'scary' | 'interesting' | 'warning';
  }[];
  className?: string;
}

export function Map({ coordinates, onClick, markers = [], className }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: coordinates[0] || [-87.6298, 41.8781], // Default to Chicago
      zoom: 12,
    });

    const currentMap = map.current;

    // Add click handler
    if (onClick) {
      currentMap.on('click', (e) => {
        onClick([e.lngLat.lat, e.lngLat.lng]);
      });
    }

    // Add route line
    if (coordinates.length > 0) {
      currentMap.on('load', () => {
        currentMap.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coordinates.map(coord => [coord[1], coord[0]]),
            },
          },
        });

        currentMap.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 3,
          },
        });
      });
    }

    return () => {
      currentMap.remove();
    };
  }, [coordinates, onClick]);

  // Update markers
  useEffect(() => {
    const currentMap = map.current;
    if (!currentMap) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach(marker => {
      const el = document.createElement('div');
      el.className = 'w-6 h-6 rounded-full flex items-center justify-center';
      
      switch (marker.type) {
        case 'funny':
          el.style.backgroundColor = '#fbbf24';
          break;
        case 'scary':
          el.style.backgroundColor = '#ef4444';
          break;
        case 'warning':
          el.style.backgroundColor = '#f97316';
          break;
        default:
          el.style.backgroundColor = '#3b82f6';
      }

      const mapboxMarker = new mapboxgl.Marker(el)
        .setLngLat([marker.coordinates[1], marker.coordinates[0]])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <h3 class="font-semibold">${marker.title}</h3>
              <p class="text-sm">${marker.description}</p>
            `)
        )
        .addTo(currentMap);

      markersRef.current.push(mapboxMarker);
    });
  }, [markers]);

  return <div ref={mapContainer} className={cn("w-full h-full rounded-lg", className)} />;
}