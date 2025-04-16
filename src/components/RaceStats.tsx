import { Card, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';

interface RaceStatsProps {
  elevationGain: number;
  caloriesBurned: number;
  averageHeartRate: number;
}

export function RaceStats({
  elevationGain,
  caloriesBurned,
  averageHeartRate,
}: RaceStatsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Race Stats</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Elevation Gain</p>
          <p className="font-semibold">{elevationGain}m</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Calories Burned</p>
          <p className="font-semibold">{caloriesBurned} kcal</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Average Heart Rate</p>
          <p className="font-semibold">{averageHeartRate} bpm</p>
        </div>
      </div>
    </div>
  );
} 