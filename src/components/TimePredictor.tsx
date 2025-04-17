'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { predictTime, getAvailableDistances, PredictionResult } from '@/lib/timePredictor';

export function TimePredictor() {
  const [isRunning, setIsRunning] = useState(true);
  const [sourceDistance, setSourceDistance] = useState('');
  const [targetDistance, setTargetDistance] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [error, setError] = useState('');

  const distances = getAvailableDistances(isRunning);

  const handlePredict = () => {
    setError('');
    setPrediction(null);

    if (!sourceDistance || !targetDistance) {
      setError('Please select both distances');
      return;
    }

    if (!hours && !minutes && !seconds) {
      setError('Please enter a finish time');
      return;
    }

    try {
      const result = predictTime(
        distances[sourceDistance],
        {
          hours: parseInt(hours || '0'),
          minutes: parseInt(minutes || '0'),
          seconds: parseInt(seconds || '0')
        },
        distances[targetDistance],
        isRunning
      );
      setPrediction(result);
    } catch (err) {
      setError('Error calculating prediction');
      console.error(err);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Race Time Predictor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Activity Type */}
          <div className="flex gap-4">
            <button
              className={`flex-1 py-2 px-4 rounded-lg ${
                isRunning ? 'bg-primary text-primary-foreground' : 'bg-secondary'
              }`}
              onClick={() => setIsRunning(true)}
            >
              Running
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-lg ${
                !isRunning ? 'bg-primary text-primary-foreground' : 'bg-secondary'
              }`}
              onClick={() => setIsRunning(false)}
            >
              Cycling
            </button>
          </div>

          {/* Distance Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Recent Race Distance</label>
              <select
                value={sourceDistance}
                onChange={(e) => setSourceDistance(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">Select distance</option>
                {Object.keys(distances).map((distance) => (
                  <option key={distance} value={distance}>
                    {distance}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Target Race Distance</label>
              <select
                value={targetDistance}
                onChange={(e) => setTargetDistance(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">Select distance</option>
                {Object.keys(distances).map((distance) => (
                  <option key={distance} value={distance}>
                    {distance}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Time Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Recent Race Time</label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="number"
                placeholder="HH"
                min="0"
                max="24"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
              <Input
                type="number"
                placeholder="MM"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
              />
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

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button 
            onClick={handlePredict}
            className="w-full"
          >
            Predict Time
          </Button>

          {/* Results */}
          {prediction && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold">Predicted Time for {targetDistance}</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Finish Time</div>
                  <div className="text-lg font-medium">{prediction.time}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Mile Pace</div>
                  <div className="text-lg font-medium">{prediction.pacePerMile}/mi</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Kilometer Pace</div>
                  <div className="text-lg font-medium">{prediction.pacePerKm}/km</div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                This prediction uses {isRunning ? 'Riegel and Cameron formulas' : 'the Riegel formula'} for {isRunning ? 'running' : 'cycling'} performance prediction.
                Actual performance may vary based on factors like terrain, weather, and training.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 