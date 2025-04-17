export interface HeartRateZone {
  name: string;
  min: number;
  max: number;
  description: string;
}

export interface HeartRateZones {
  maxHR: number;
  zones: HeartRateZone[];
}

// Calculates max heart rate using the Tanaka formula
function calculateMaxHR(age: number): number {
  return Math.round(208 - (0.7 * age));
}

// Calculates heart rate reserve using Karvonen formula
function calculateHRR(maxHR: number, restingHR: number): number {
  return maxHR - restingHR;
}

// Calculates target heart rate for a given percentage
function calculateTargetHR(maxHR: number, restingHR: number, percentage: number): number {
  const hrr = calculateHRR(maxHR, restingHR);
  return Math.round(restingHR + (hrr * percentage));
}

export function calculateHeartRateZones(age: number, restingHR: number): HeartRateZones {
  const maxHR = calculateMaxHR(age);

  const zones: HeartRateZone[] = [
    {
      name: 'Zone 1 - Recovery',
      min: calculateTargetHR(maxHR, restingHR, 0.50),
      max: calculateTargetHR(maxHR, restingHR, 0.60),
      description: 'Very light intensity, active recovery, warm-up'
    },
    {
      name: 'Zone 2 - Endurance',
      min: calculateTargetHR(maxHR, restingHR, 0.60),
      max: calculateTargetHR(maxHR, restingHR, 0.70),
      description: 'Light intensity, improves basic endurance and fat burning'
    },
    {
      name: 'Zone 3 - Tempo',
      min: calculateTargetHR(maxHR, restingHR, 0.70),
      max: calculateTargetHR(maxHR, restingHR, 0.80),
      description: 'Moderate intensity, improves aerobic fitness and efficiency'
    },
    {
      name: 'Zone 4 - Threshold',
      min: calculateTargetHR(maxHR, restingHR, 0.80),
      max: calculateTargetHR(maxHR, restingHR, 0.90),
      description: 'Hard intensity, increases lactate threshold'
    },
    {
      name: 'Zone 5 - VO2 Max',
      min: calculateTargetHR(maxHR, restingHR, 0.90),
      max: maxHR,
      description: 'Maximum intensity, improves speed and power'
    }
  ];

  return {
    maxHR,
    zones
  };
} 