// Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

// Mock achievements data
const mockAchievements: Achievement[] = [
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

/**
 * Get user achievements
 * In a real application, this would fetch from a database
 */
export async function getUserAchievements(userId?: string): Promise<Achievement[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data for now
  return mockAchievements;
}

/**
 * Check if a user has earned a specific achievement
 */
export async function hasAchievement(userId: string, achievementId: string): Promise<boolean> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // For demo purposes, just check if the achievement exists in our mock data
  return mockAchievements.some(a => a.id === achievementId);
}

/**
 * Award an achievement to a user
 */
export async function awardAchievement(userId: string, achievementId: string): Promise<Achievement | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Find the achievement
  const achievement = mockAchievements.find(a => a.id === achievementId);
  
  if (!achievement) {
    return null;
  }
  
  // In a real app, you would save this to a database
  console.log(`Awarded achievement ${achievementId} to user ${userId}`);
  
  return achievement;
} 