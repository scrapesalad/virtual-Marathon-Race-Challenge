'use client';

import dynamic from 'next/dynamic';
import { MapProps } from './Map';

const Map = dynamic<MapProps>(() => import('./Map').then(mod => mod.Map), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading map...</div>
    </div>
  ),
});

export function DynamicMap({ coordinates, progress = 0, className = '' }: MapProps) {
  return <Map coordinates={coordinates} progress={progress} className={className} />;
} 