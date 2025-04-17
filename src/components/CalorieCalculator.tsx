'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { calculateCalories, activities, lbsToKg, type CalorieResult } from '@/lib/calorieCalculator';

export function CalorieCalculator() {
  const [weight, setWeight] = useState('');
  const [isKg, setIsKg] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [result, setResult] = useState<CalorieResult | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    setError('');
    setResult(null);

    if (!weight || !selectedActivity || !duration) {
      setError('Please fill in all fields');
      return;
    }

    const weightNum = parseFloat(weight);
    const durationNum = parseFloat(duration);

    if (weightNum <= 0) {
      setError('Please enter a valid weight');
      return;
    }

    if (durationNum <= 0) {
      setError('Please enter a valid duration');
      return;
    }

    const activity = activities.find(a => a.name === selectedActivity);
    if (!activity) {
      setError('Please select an activity');
      return;
    }

    try {
      const weightKg = isKg ? weightNum : lbsToKg(weightNum);
      const result = calculateCalories(weightKg, activity, durationNum);
      setResult(result);
    } catch (err) {
      setError('Error calculating calories');
      console.error(err);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Calorie Expenditure Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Weight Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Weight</label>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder={`Enter weight in ${isKg ? 'kg' : 'lbs'}`}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsKg(!isKg)}
                className="w-24"
              >
                {isKg ? 'kg' : 'lbs'}
              </Button>
            </div>
          </div>

          {/* Activity Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Activity</label>
            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="">Select an activity</option>
              {activities.map((activity) => (
                <option key={activity.name} value={activity.name}>
                  {activity.name}
                </option>
              ))}
            </select>
          </div>

          {/* Duration Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
            <Input
              type="number"
              placeholder="Enter duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="0"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button 
            onClick={handleCalculate}
            className="w-full"
          >
            Calculate Calories
          </Button>

          {/* Results */}
          {result && (
            <div className="space-y-4 border-t pt-4">
              <div className="text-center mb-4">
                <div className="text-sm text-gray-500">Estimated Calories Burned</div>
                <div className="text-3xl font-bold">{result.calories} kcal</div>
              </div>
              
              <div className="bg-secondary rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">{result.activity.name}</h3>
                <p className="text-sm text-gray-500">{result.activity.description}</p>
                <div className="mt-2 text-sm">
                  <span className="font-medium">Duration:</span> {result.duration} minutes
                </div>
                <div className="mt-1 text-sm">
                  <span className="font-medium">Intensity Level (MET):</span> {result.activity.met}
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Calculations are based on the Metabolic Equivalent of Task (MET) values from the Compendium of Physical Activities.
                Actual calorie expenditure may vary based on individual factors such as fitness level, terrain, and weather conditions.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 