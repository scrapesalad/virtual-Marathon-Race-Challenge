'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { getTrainingPaces, TrainingPaces } from '@/lib/paceCalculator';

const DISTANCES = [
  { value: '5', label: '5K' },
  { value: '10', label: '10K' },
  { value: '21.0975', label: 'Half Marathon' },
  { value: '42.195', label: 'Marathon' }
];

export function PaceCalculator() {
  const [distance, setDistance] = useState('42.195');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [paces, setPaces] = useState<TrainingPaces | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    setError('');
    
    // Validate inputs
    if (!hours && !minutes && !seconds) {
      setError('Please enter a finish time');
      return;
    }

    // Convert time to seconds
    const totalSeconds = 
      (parseInt(hours || '0') * 3600) +
      (parseInt(minutes || '0') * 60) +
      parseInt(seconds || '0');

    if (totalSeconds === 0) {
      setError('Please enter a valid time');
      return;
    }

    try {
      const results = getTrainingPaces(parseFloat(distance), totalSeconds);
      setPaces(results);
    } catch (err) {
      setError('Error calculating paces');
      console.error(err);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Jack Daniels' VDOT Running Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Input Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Race Distance</label>
              <select
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {DISTANCES.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Race Time</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Input
                    type="number"
                    placeholder="HH"
                    min="0"
                    max="24"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="MM"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="SS"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button 
              onClick={handleCalculate}
              className="w-full"
            >
              Calculate Paces
            </Button>
          </div>

          {/* Results */}
          {paces && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Training Paces</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-4 gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <div>Training Zone</div>
                  <div>Mile Pace</div>
                  <div>Km Pace</div>
                  <div>Race Time</div>
                </div>
                {Object.entries(paces).map(([zone, pace]) => (
                  <div key={zone} className="grid grid-cols-4 gap-2 py-2 border-t">
                    <div className="capitalize">{zone}</div>
                    <div>{pace.milesPace}/mi</div>
                    <div>{pace.kmPace}/km</div>
                    <div>{pace.finishTime}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Based on Jack Daniels' VDOT running formula. Use these paces as guidelines for your training.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 