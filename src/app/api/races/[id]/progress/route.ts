import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mock database for race progress
let raceProgress: Record<string, any[]> = {};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const raceId = params.id;
    const progress = raceProgress[raceId] || [];
    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching race progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    const progressData = await request.json();

    // Validate required fields
    const requiredFields = ['userId', 'distance', 'currentLocation', 'timestamp'];
    for (const field of requiredFields) {
      if (!progressData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Initialize progress array for race if it doesn't exist
    if (!raceProgress[raceId]) {
      raceProgress[raceId] = [];
    }

    // Add progress update
    const update = {
      id: `prog_${Date.now()}`,
      raceId,
      ...progressData,
      timestamp: new Date().toISOString(),
    };

    raceProgress[raceId].push(update);

    // In a real app, broadcast update to connected clients via WebSocket
    // await broadcastProgressUpdate(raceId, update);

    return NextResponse.json(update);
  } catch (error) {
    console.error('Error updating race progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 