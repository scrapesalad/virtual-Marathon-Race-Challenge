'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  distance: number;
  pace: string;
  isFriend: boolean;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  userPosition: number;
}

export function Leaderboard({ entries, userPosition }: LeaderboardProps) {
  const [filter, setFilter] = useState<'all' | 'friends'>('all');
  
  const filteredEntries = filter === 'all' 
    ? entries 
    : entries.filter(entry => entry.isFriend);
  
  const getPositionBadge = (position: number) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `#${position}`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle>Leaderboard</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant={filter === 'all' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={filter === 'friends' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setFilter('friends')}
            >
              Friends
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground w-[60px]">
                    Rank
                  </th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                    Runner
                  </th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground w-[100px]">
                    Distance
                  </th>
                  <th className="h-10 px-2 text-right align-middle font-medium text-muted-foreground w-[80px]">
                    Pace
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, index) => (
                  <tr 
                    key={entry.id} 
                    className={`border-b transition-colors hover:bg-muted/50 ${
                      entry.id === 'current-user' ? 'bg-muted' : ''
                    }`}
                  >
                    <td className="p-2 align-middle font-medium">
                      {getPositionBadge(index + 1)}
                    </td>
                    <td className="p-2 align-middle">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                          <img 
                            src={entry.avatar} 
                            alt={`${entry.name}'s avatar`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium leading-none">{entry.name}</span>
                          {entry.isFriend && (
                            <Badge variant="success" className="mt-1">Friend</Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-2 align-middle">
                      {entry.distance.toFixed(1)} km
                    </td>
                    <td className="p-2 align-middle text-right">
                      {entry.pace}/km
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {filteredEntries.length === 0 && (
          <div className="flex items-center justify-center py-6">
            <p className="text-muted-foreground text-sm">
              {filter === 'friends' 
                ? 'Add friends to see them on the leaderboard.' 
                : 'Be the first to join!'}
            </p>
          </div>
        )}
        
        <div className="mt-4 text-sm text-muted-foreground text-center">
          Your position: {getPositionBadge(userPosition)} out of {entries.length} participants
        </div>
      </CardContent>
    </Card>
  );
} 