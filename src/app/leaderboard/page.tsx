'use client';

import { Leaderboard } from '@/components/Leaderboard';

// Mock data for the leaderboard
const MOCK_LEADERBOARD_ENTRIES = [
  { id: 'user-1', name: 'Alex Johnson', avatar: 'AJ', distance: 42.2, pace: "4'15\"/km", isFriend: true },
  { id: 'user-2', name: 'Sarah Williams', avatar: 'SW', distance: 41.8, pace: "4'18\"/km", isFriend: false },
  { id: 'user-3', name: 'Michael Brown', avatar: 'MB', distance: 41.5, pace: "4'20\"/km", isFriend: true },
  { id: 'user-4', name: 'Emily Davis', avatar: 'ED', distance: 41.2, pace: "4'22\"/km", isFriend: false },
  { id: 'user-5', name: 'David Wilson', avatar: 'DW', distance: 41.0, pace: "4'23\"/km", isFriend: false },
  { id: 'current-user', name: 'You', avatar: 'YO', distance: 40.5, pace: "4'25\"/km", isFriend: true },
  { id: 'user-7', name: 'Jennifer Lee', avatar: 'JL', distance: 40.2, pace: "4'26\"/km", isFriend: false },
  { id: 'user-8', name: 'Robert Taylor', avatar: 'RT', distance: 40.0, pace: "4'27\"/km", isFriend: true },
  { id: 'user-9', name: 'Lisa Anderson', avatar: 'LA', distance: 39.8, pace: "4'28\"/km", isFriend: false },
  { id: 'user-10', name: 'James Martin', avatar: 'JM', distance: 39.5, pace: "4'30\"/km", isFriend: false },
];

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Race Leaderboard
        </h1>
        
        <Leaderboard 
          entries={MOCK_LEADERBOARD_ENTRIES}
          userPosition={6}
        />
      </div>
    </div>
  );
} 