'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface RaceUpdate {
  id: string;
  message: string;
  timestamp: string;
  type: 'pace' | 'competitor' | 'weather' | 'landmark' | 'motivation';
  priority: 'low' | 'medium' | 'high';
}

interface AIRaceCompanionProps {
  currentPace: string;
  targetPace: string;
  distanceCompleted: number;
  totalDistance: number;
  currentLocation: string;
  nextLandmark: string;
  distanceToLandmark: number;
  nearbyRunners: number;
  weatherConditions: {
    temperature: number;
    condition: string;
    windSpeed: number;
    windDirection: string;
  };
}

export function AIRaceCompanion({
  currentPace,
  targetPace,
  distanceCompleted,
  totalDistance,
  currentLocation,
  nextLandmark,
  distanceToLandmark,
  nearbyRunners,
  weatherConditions
}: AIRaceCompanionProps) {
  const [updates, setUpdates] = useState<RaceUpdate[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isAutoAnnounce, setIsAutoAnnounce] = useState(true);
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);
  const speechUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis;
    }
    
    return () => {
      if (speechUtterance.current) {
        speechSynthesis.current?.cancel();
      }
    };
  }, []);

  // Generate race updates based on props
  useEffect(() => {
    const generateUpdates = () => {
      const newUpdates: RaceUpdate[] = [];
      
      // Pace update
      const paceDiff = parseFloat(currentPace.replace(':', '.')) - parseFloat(targetPace.replace(':', '.'));
      if (Math.abs(paceDiff) > 0.5) {
        newUpdates.push({
          id: `pace-${Date.now()}`,
          message: paceDiff > 0 
            ? `You're running ${paceDiff.toFixed(1)} minutes slower than your target pace. Consider picking up the pace.`
            : `You're running ${Math.abs(paceDiff).toFixed(1)} minutes faster than your target pace. Great job!`,
          timestamp: new Date().toISOString(),
          type: 'pace',
          priority: Math.abs(paceDiff) > 1 ? 'high' : 'medium'
        });
      }
      
      // Landmark update
      if (distanceToLandmark < 1) {
        newUpdates.push({
          id: `landmark-${Date.now()}`,
          message: `You're approaching ${nextLandmark}. This is a significant milestone in your race!`,
          timestamp: new Date().toISOString(),
          type: 'landmark',
          priority: 'medium'
        });
      }
      
      // Competitor update
      if (nearbyRunners > 0) {
        newUpdates.push({
          id: `competitor-${Date.now()}`,
          message: `There are ${nearbyRunners} runners within 500 meters of you. You're not alone on this journey!`,
          timestamp: new Date().toISOString(),
          type: 'competitor',
          priority: 'low'
        });
      }
      
      // Weather update
      if (weatherConditions.windSpeed > 15) {
        newUpdates.push({
          id: `weather-${Date.now()}`,
          message: `Heads up! You're facing ${weatherConditions.windSpeed} km/h ${weatherConditions.windDirection} winds. Adjust your effort accordingly.`,
          timestamp: new Date().toISOString(),
          type: 'weather',
          priority: 'high'
        });
      }
      
      // Motivation update (random)
      if (Math.random() > 0.7) {
        const motivationalMessages = [
          "You're doing great! Keep pushing!",
          "Remember why you started this race.",
          "Your body is capable of more than you think.",
          "Every step brings you closer to the finish line.",
          "You're stronger than you think."
        ];
        
        newUpdates.push({
          id: `motivation-${Date.now()}`,
          message: motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)],
          timestamp: new Date().toISOString(),
          type: 'motivation',
          priority: 'low'
        });
      }
      
      if (newUpdates.length > 0) {
        setUpdates(prev => [...newUpdates, ...prev].slice(0, 10));
        
        // Announce updates if auto-announce is enabled and not muted
        if (isAutoAnnounce && !isMuted && speechSynthesis.current) {
          newUpdates.forEach(update => {
            if (update.priority === 'high' || (update.priority === 'medium' && Math.random() > 0.5)) {
              announceUpdate(update.message);
            }
          });
        }
      }
    };
    
    // Generate updates every 30 seconds
    const interval = setInterval(generateUpdates, 30000);
    
    // Generate initial updates
    generateUpdates();
    
    return () => clearInterval(interval);
  }, [
    currentPace, 
    targetPace, 
    distanceToLandmark, 
    nextLandmark, 
    nearbyRunners, 
    weatherConditions, 
    isAutoAnnounce, 
    isMuted
  ]);

  const announceUpdate = (message: string) => {
    if (!speechSynthesis.current || isMuted) return;
    
    // Cancel any ongoing speech
    speechSynthesis.current.cancel();
    
    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Store reference to cancel later if needed
    speechUtterance.current = utterance;
    
    // Speak the message
    speechSynthesis.current.speak(utterance);
  };

  const getUpdateIcon = (type: RaceUpdate['type']) => {
    switch (type) {
      case 'pace': return '⏱️';
      case 'competitor': return '👥';
      case 'weather': return '🌤️';
      case 'landmark': return '🏛️';
      case 'motivation': return '💪';
      default: return 'ℹ️';
    }
  };

  const getPriorityColor = (priority: RaceUpdate['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>AI Race Companion</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? '🔇 Unmute' : '🔊 Mute'}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsAutoAnnounce(!isAutoAnnounce)}
            >
              {isAutoAnnounce ? '🔄 Auto: On' : '🔄 Auto: Off'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium">Current Location: {currentLocation}</p>
          <p className="text-sm text-muted-foreground">
            Progress: {distanceCompleted.toFixed(1)} / {totalDistance.toFixed(1)} km
          </p>
          <div className="mt-2 flex justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Current Pace</p>
              <p className="font-medium">{currentPace} min/km</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Target Pace</p>
              <p className="font-medium">{targetPace} min/km</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Weather</p>
              <p className="font-medium">{weatherConditions.temperature}°C, {weatherConditions.condition}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {updates.length > 0 ? (
            updates.map((update) => (
              <div 
                key={update.id} 
                className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getUpdateIcon(update.type)}</span>
                    <Badge variant="default" className={getPriorityColor(update.priority)}>
                      {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                    </Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => announceUpdate(update.message)}
                    disabled={isMuted}
                  >
                    🔊
                  </Button>
                </div>
                <p className="mt-2">{update.message}</p>
                <span className="text-xs text-muted-foreground mt-1 block">
                  {new Date(update.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No updates yet. Your AI companion will provide guidance as you progress.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 