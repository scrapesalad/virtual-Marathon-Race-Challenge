'use client';

import { BadgesShelf } from '@/components/BadgesShelf';
import { RaceView } from '@/components/RaceView';
import { Leaderboard } from '@/components/Leaderboard';
import { nycMarathonRoute } from '@/data/nyc-marathon-route';
import StravaConnection from '@/components/auth/StravaConnection';

export default function DashboardPage() {
  const mockAchievements = [
    {
      id: '1',
      name: 'First Race',
      description: 'Completed your first virtual race',
      icon: '🏃',
      earnedAt: '2024-03-15'
    },
    {
      id: '2',
      name: 'Speed Demon',
      description: 'Achieved a pace under 5:00/km',
      icon: '⚡',
      earnedAt: '2024-03-20'
    },
    {
      id: '3',
      name: 'Marathon Master',
      description: 'Completed a full marathon',
      icon: '🏅',
      earnedAt: '2024-04-01'
    }
  ];

  // Ensure coordinates are properly typed as [number, number][]
  const routeCoordinates = nycMarathonRoute.coordinates as [number, number][];

  // Create proper Date objects
  const startDate = new Date('2024-11-03T00:00:00');
  const endDate = new Date('2024-11-03T23:59:59');
  const estimatedFinishTime = new Date('2024-11-03T14:30:00');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Top row with Strava connection */}
      <div className="mb-8">
        <StravaConnection />
      </div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Race view - spans 2 columns on large screens */}
        <div className="lg:col-span-2">
          <RaceView
            raceName="TCS New York City Marathon 2024"
            raceType="Marathon"
            startDate={startDate}
            endDate={endDate}
            currentDistance={15.5}
            totalDistance={42.2}
            currentPace="5:12"
            estimatedFinishTime="2024-11-03T14:30:00"
            position={42}
            totalParticipants={50000}
            timeLeft="180 days"
            elevationGain={250}
            caloriesBurned={1200}
            averageHeartRate={145}
            route={{
              coordinates: routeCoordinates
            }}
          />
        </div>
        
        {/* Right sidebar - achievements and leaderboard */}
        <div className="space-y-8">
          <BadgesShelf achievements={mockAchievements} />
          <Leaderboard
            entries={[
              {
                id: '1',
                name: 'John Doe',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
                distance: 42.2,
                pace: '4:48',
                isFriend: true
              },
              {
                id: '2',
                name: 'Jane Smith',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
                distance: 38.5,
                pace: '5:06',
                isFriend: false
              },
              {
                id: '3',
                name: 'Mike Johnson',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
                distance: 35.2,
                pace: '5:18',
                isFriend: true
              }
            ]}
            userPosition={4}
          />
        </div>
      </div>
    </div>
  );
} 