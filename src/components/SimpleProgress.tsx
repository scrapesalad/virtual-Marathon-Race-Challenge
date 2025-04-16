'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';

interface SimpleProgressProps {
  milesLogged: number;
  totalMiles: number;
  raceName: string;
}

const MILESTONES = [
  { miles: 3.1, label: '5K' },
  { miles: 6.2, label: '10K' },
  { miles: 13.1, label: 'Half' },
  { miles: 20, label: '20M' },
  { miles: 26.2, label: 'Finish' }
];

export function SimpleProgress({ milesLogged, totalMiles = 26.2, raceName }: SimpleProgressProps) {
  const progress = (milesLogged / totalMiles) * 100;

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {raceName}
            </h2>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {progress.toFixed(1)}% Complete
            </span>
          </div>

          {/* Progress bar with milestones */}
          <div className="relative">
            <Progress value={progress} className="h-4" />
            
            {/* Milestone markers */}
            <div className="absolute inset-0 flex items-center">
              {MILESTONES.map((milestone) => {
                const position = (milestone.miles / totalMiles) * 100;
                const isReached = milesLogged >= milestone.miles;
                
                return (
                  <div
                    key={milestone.miles}
                    className="absolute flex flex-col items-center"
                    style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                  >
                    {/* Vertical line */}
                    <div 
                      className={`w-0.5 h-3 ${
                        isReached ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                    {/* Label */}
                    <span 
                      className={`text-xs mt-1 font-medium ${
                        isReached 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {milestone.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {milesLogged.toFixed(1)} miles logged
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {totalMiles} miles total
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 