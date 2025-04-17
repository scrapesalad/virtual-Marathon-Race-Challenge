interface RaceTime {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface PredictionResult {
  time: string;        // Format: "HH:MM:SS"
  pacePerMile: string; // Format: "MM:SS"
  pacePerKm: string;   // Format: "MM:SS"
}

const RUNNING_DISTANCES = {
  '5K': 5,
  '10K': 10,
  '15K': 15,
  'Half Marathon': 21.0975,
  'Marathon': 42.195,
};

const CYCLING_DISTANCES = {
  '40K': 40,
  '100K': 100,
  'Century': 160.934, // 100 miles
};

function timeToSeconds(time: RaceTime): number {
  return (time.hours * 3600) + (time.minutes * 60) + time.seconds;
}

function secondsToTimeString(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function calculatePace(totalSeconds: number, distance: number, useKm: boolean = false): string {
  const distanceInUnits = useKm ? distance : distance / 1.60934;
  const secondsPerUnit = totalSeconds / distanceInUnits;
  
  const minutes = Math.floor(secondsPerUnit / 60);
  const seconds = Math.round(secondsPerUnit % 60);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Riegel Formula: T2 = T1 * (D2/D1)^1.06
function riegelFormula(time1: number, dist1: number, dist2: number, activityFactor: number = 1.06): number {
  return time1 * Math.pow(dist2 / dist1, activityFactor);
}

// Cameron Formula: T2 = T1 * (D2/D1) * (1.0099 + D2^0.0099)
function cameronFormula(time1: number, dist1: number, dist2: number): number {
  return time1 * (dist2 / dist1) * (1.0099 + Math.pow(dist2, 0.0099));
}

export function predictTime(
  distance1: number,
  time: RaceTime,
  targetDistance: number,
  isRunning: boolean = true
): PredictionResult {
  const timeSeconds = timeToSeconds(time);
  
  // Use different formulas based on activity type and distance ratio
  const predictedSeconds = isRunning ?
    // Use Cameron for longer predictions, Riegel for shorter ones
    targetDistance > distance1 * 2 ?
      cameronFormula(timeSeconds, distance1, targetDistance) :
      riegelFormula(timeSeconds, distance1, targetDistance) :
    // Use Riegel with different factor for cycling
    riegelFormula(timeSeconds, distance1, targetDistance, 1.04);

  return {
    time: secondsToTimeString(predictedSeconds),
    pacePerMile: calculatePace(predictedSeconds, targetDistance, false),
    pacePerKm: calculatePace(predictedSeconds, targetDistance, true)
  };
}

export function getAvailableDistances(isRunning: boolean = true): Record<string, number> {
  return isRunning ? RUNNING_DISTANCES : CYCLING_DISTANCES;
} 