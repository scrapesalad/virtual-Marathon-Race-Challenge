import { NextResponse } from 'next/server';
import { getUserAchievements } from '@/services/achievements';

export async function GET() {
  try {
    // In a real app, you would get the userId from the session
    const userId = 'user-123'; // Mock user ID
    
    // Call the function directly
    const achievements = await getUserAchievements(userId);
    
    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
} 