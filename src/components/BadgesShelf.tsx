'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { Achievement } from '../services/achievements';

interface BadgesShelfProps {
  achievements?: Achievement[];
}

export function BadgesShelf({ achievements: propAchievements }: BadgesShelfProps) {
  const [achievements, setAchievements] = useState<Achievement[]>(propAchievements || []);
  const [loading, setLoading] = useState(!propAchievements);

  useEffect(() => {
    // If achievements are provided as props, use them directly
    if (propAchievements) {
      setAchievements(propAchievements);
      setLoading(false);
      return;
    }

    // Otherwise, fetch achievements from the API
    async function fetchAchievements() {
      try {
        const response = await fetch('/api/achievements');
        if (!response.ok) {
          throw new Error('Failed to fetch achievements');
        }
        const data = await response.json();
        setAchievements(data);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAchievements();
  }, [propAchievements]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Loading achievements...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        {achievements.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex flex-col items-center p-4 rounded-lg border bg-card text-card-foreground"
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <h3 className="font-semibold text-center">{achievement.name}</h3>
                <p className="text-sm text-muted-foreground text-center">
                  {achievement.description}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No achievements yet. Complete races to earn badges!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 