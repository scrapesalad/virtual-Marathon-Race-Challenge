export interface Activity {
  name: string;
  met: number; // Metabolic Equivalent of Task
  description: string;
}

export interface CalorieResult {
  calories: number;
  duration: number; // in minutes
  activity: Activity;
}

// MET values sourced from the Compendium of Physical Activities
export const activities: Activity[] = [
  {
    name: 'Walking (3 mph)',
    met: 3.5,
    description: 'Casual walking at a moderate pace'
  },
  {
    name: 'Walking (4 mph)',
    met: 4.3,
    description: 'Brisk walking'
  },
  {
    name: 'Jogging (5 mph)',
    met: 8.0,
    description: 'Slow jogging or running'
  },
  {
    name: 'Running (6 mph)',
    met: 9.8,
    description: 'Running at 10-minute mile pace'
  },
  {
    name: 'Running (7 mph)',
    met: 11.0,
    description: 'Running at 8.5-minute mile pace'
  },
  {
    name: 'Running (8 mph)',
    met: 11.8,
    description: 'Running at 7.5-minute mile pace'
  },
  {
    name: 'Running (10 mph)',
    met: 14.5,
    description: 'Running at 6-minute mile pace'
  },
  {
    name: 'Cycling (10-12 mph)',
    met: 6.8,
    description: 'Leisure cycling at moderate effort'
  },
  {
    name: 'Cycling (12-14 mph)',
    met: 8.0,
    description: 'Cycling at vigorous effort'
  },
  {
    name: 'Cycling (14-16 mph)',
    met: 10.0,
    description: 'Cycling at very vigorous effort'
  },
  {
    name: 'Cycling (16-19 mph)',
    met: 12.0,
    description: 'Cycling at racing or high-intensity training'
  },
  {
    name: 'Swimming (leisure)',
    met: 6.0,
    description: 'Recreational swimming'
  },
  {
    name: 'Swimming (laps)',
    met: 8.3,
    description: 'Vigorous lap swimming'
  },
  {
    name: 'Trail Running',
    met: 9.0,
    description: 'Running on trails or varied terrain'
  },
  {
    name: 'Hiking',
    met: 5.3,
    description: 'Hiking on trails with elevation changes'
  }
];

/**
 * Calculates calories burned during an activity
 * @param weightKg - Weight in kilograms
 * @param activity - Activity object containing MET value
 * @param durationMinutes - Duration of activity in minutes
 * @returns Calories burned
 */
export function calculateCalories(weightKg: number, activity: Activity, durationMinutes: number): CalorieResult {
  // Formula: Calories = MET × Weight (kg) × Duration (hours)
  const durationHours = durationMinutes / 60;
  const calories = Math.round(activity.met * weightKg * durationHours);

  return {
    calories,
    duration: durationMinutes,
    activity
  };
}

/**
 * Converts weight from pounds to kilograms
 */
export function lbsToKg(weightLbs: number): number {
  return weightLbs * 0.45359237;
}

/**
 * Converts weight from kilograms to pounds
 */
export function kgToLbs(weightKg: number): number {
  return weightKg / 0.45359237;
} 