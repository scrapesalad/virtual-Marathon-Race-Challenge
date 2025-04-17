'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { calculateHeartRateZones, type HeartRateZones } from '@/lib/heartRateCalculator';

export function HeartRateCalculator() {
  const [age, setAge] = useState('');
  const [restingHR, setRestingHR] = useState('');
  const [zones, setZones] = useState<HeartRateZones | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    setError('');
    setZones(null);

    if (!age || !restingHR) {
      setError('Please enter both age and resting heart rate');
      return;
    }

    const ageNum = parseInt(age);
    const restingHRNum = parseInt(restingHR);

    if (ageNum < 15 || ageNum > 100) {
      setError('Please enter a valid age between 15 and 100');
      return;
    }

    if (restingHRNum < 30 || restingHRNum > 100) {
      setError('Please enter a valid resting heart rate between 30 and 100');
      return;
    }

    try {
      const result = calculateHeartRateZones(ageNum, restingHRNum);
      setZones(result);
    } catch (err) {
      setError('Error calculating heart rate zones');
      console.error(err);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Heart Rate Zone Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Input Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Age</label>
              <Input
                type="number"
                placeholder="Enter your age"
                min="15"
                max="100"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Resting Heart Rate</label>
              <Input
                type="number"
                placeholder="Beats per minute"
                min="30"
                max="100"
                value={restingHR}
                onChange={(e) => setRestingHR(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button 
            onClick={handleCalculate}
            className="w-full"
          >
            Calculate Zones
          </Button>

          {/* Results */}
          {zones && (
            <div className="space-y-4 border-t pt-4">
              <div className="text-center mb-4">
                <div className="text-sm text-gray-500">Estimated Maximum Heart Rate</div>
                <div className="text-2xl font-bold">{zones.maxHR} BPM</div>
              </div>
              
              <div className="space-y-4">
                {zones.zones.map((zone, index) => (
                  <div key={index} className="p-4 rounded-lg bg-secondary">
                    <h3 className="font-semibold text-lg">{zone.name}</h3>
                    <div className="text-lg">
                      {zone.min} - {zone.max} BPM
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {zone.description}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-500 mt-4">
                These zones are calculated using the Karvonen formula with the Tanaka equation for maximum heart rate.
                Your actual zones may vary based on fitness level and individual factors.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 