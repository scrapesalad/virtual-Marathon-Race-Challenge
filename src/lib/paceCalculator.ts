// VDOT values and corresponding velocities (in meters per minute)
interface VdotPaces {
  easy: number;
  marathon: number;
  threshold: number;
  interval: number;
  repetition: number;
}

const VDOT_TABLE: Record<number, VdotPaces> = {
  30: { easy: 169, marathon: 177, threshold: 183, interval: 189, repetition: 198 },
  35: { easy: 183, marathon: 192, threshold: 199, interval: 206, repetition: 215 },
  40: { easy: 196, marathon: 207, threshold: 214, interval: 222, repetition: 232 },
  45: { easy: 209, marathon: 221, threshold: 229, interval: 238, repetition: 249 },
  50: { easy: 222, marathon: 234, threshold: 243, interval: 253, repetition: 265 },
  55: { easy: 234, marathon: 248, threshold: 257, interval: 268, repetition: 281 },
  60: { easy: 246, marathon: 261, threshold: 271, interval: 282, repetition: 296 },
  65: { easy: 258, marathon: 273, threshold: 284, interval: 296, repetition: 311 },
  70: { easy: 269, marathon: 286, threshold: 297, interval: 310, repetition: 326 },
  75: { easy: 281, marathon: 298, threshold: 310, interval: 324, repetition: 340 },
  80: { easy: 292, marathon: 310, threshold: 323, interval: 337, repetition: 354 },
};

export interface RacePace {
  milesPace: string;   // Format: "MM:SS"
  kmPace: string;      // Format: "MM:SS"
  finishTime: string;  // Format: "HH:MM:SS"
}

export interface TrainingPaces {
  easy: RacePace;
  marathon: RacePace;
  threshold: RacePace;
  interval: RacePace;
  repetition: RacePace;
}

function calculateVDOT(raceDistance: number, raceTime: number): number {
  // Time in minutes
  const timeMinutes = raceTime / 60;
  
  // Distance in meters
  const distanceMeters = raceDistance * 1000;
  
  // Velocity in meters per minute
  const velocity = distanceMeters / timeMinutes;
  
  // Find the closest VDOT value
  let closestVdot = 30;
  let minDiff = Infinity;
  
  for (const vdot of Object.keys(VDOT_TABLE).map(Number)) {
    const marathonVelocity = VDOT_TABLE[vdot].marathon;
    const diff = Math.abs(marathonVelocity - velocity);
    if (diff < minDiff) {
      minDiff = diff;
      closestVdot = vdot;
    }
  }
  
  return closestVdot;
}

function formatPace(metersPerMinute: number, useKm: boolean = false): string {
  const minutesPerUnit = useKm ? 
    1000 / metersPerMinute : 
    1609.34 / metersPerMinute;
  
  const minutes = Math.floor(minutesPerUnit);
  const seconds = Math.round((minutesPerUnit - minutes) * 60);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function formatFinishTime(metersPerMinute: number, distance: number): string {
  const totalMinutes = (distance * 1000) / metersPerMinute;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  const seconds = Math.round((totalMinutes % 1) * 60);
  
  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function calculatePaces(velocity: number, distance: number): RacePace {
  return {
    milesPace: formatPace(velocity),
    kmPace: formatPace(velocity, true),
    finishTime: formatFinishTime(velocity, distance)
  };
}

export function getTrainingPaces(raceDistance: number, raceTimeSeconds: number): TrainingPaces {
  const vdot = calculateVDOT(raceDistance, raceTimeSeconds);
  const paces = VDOT_TABLE[vdot];
  
  return {
    easy: calculatePaces(paces.easy, raceDistance),
    marathon: calculatePaces(paces.marathon, raceDistance),
    threshold: calculatePaces(paces.threshold, raceDistance),
    interval: calculatePaces(paces.interval, raceDistance),
    repetition: calculatePaces(paces.repetition, raceDistance)
  };
} 