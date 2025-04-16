import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const stravaToken = cookieStore.get('strava_access_token');

    if (!stravaToken) {
      return NextResponse.json(
        { error: 'Unauthorized - Please connect your Strava account' },
        { status: 401 }
      );
    }

    const raceId = params.id;
    
    // In a real app, verify if:
    // 1. Race exists
    // 2. User has invitation (if private race)
    // 3. Race hasn't started yet
    // 4. User isn't already participating

    // Mock joining race
    const joinedRace = {
      raceId,
      userId: 'user_123', // In a real app, get from session
      joinedAt: new Date().toISOString(),
      status: 'registered'
    };

    return NextResponse.json(joinedRace);
  } catch (error) {
    console.error('Error joining race:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 