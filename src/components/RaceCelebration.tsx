'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface RaceCelebrationProps {
  raceName: string;
  finishTime: string;
  position: number;
  totalParticipants: number;
  onViewCertificate: () => void;
  onShareResult: () => void;
}

export function RaceCelebration({
  raceName,
  finishTime,
  position,
  totalParticipants,
  onViewCertificate,
  onShareResult,
}: RaceCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const getPositionText = () => {
    if (position === 1) return '1st Place! 🥇';
    if (position === 2) return '2nd Place! 🥈';
    if (position === 3) return '3rd Place! 🥉';
    return `${position}th Place`;
  };

  const getAchievementBadge = () => {
    const percentile = (position / totalParticipants) * 100;
    if (percentile <= 10) return { text: 'Top 10%', color: 'success' as const };
    if (percentile <= 25) return { text: 'Top 25%', color: 'success' as const };
    if (percentile <= 50) return { text: 'Top 50%', color: 'warning' as const };
    return { text: 'Finisher', color: 'default' as const };
  };

  const achievement = getAchievementBadge();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-6 text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Congratulations! 🎉</h2>
            <p className="text-gray-600">You've completed {raceName}!</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="text-3xl font-bold text-primary">
              {getPositionText()}
            </div>
            <div className="text-xl">
              Finish Time: {finishTime}
            </div>
            <Badge variant={achievement.color}>
              {achievement.text}
            </Badge>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={onViewCertificate} variant="default">
              View Finisher Certificate
            </Button>
            <Button onClick={onShareResult} variant="outline">
              Share Result
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 