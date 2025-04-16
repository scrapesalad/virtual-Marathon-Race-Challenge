import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mock database for participants
let participants: any[] = [];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const raceId = params.id;
    
    // Filter participants by race ID
    const raceParticipants = participants.filter(p => p.raceId === raceId);

    return NextResponse.json(raceParticipants);
  } catch (error) {
    console.error('Error fetching participants:', error);
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
    const participantData = await request.json();

    // Validate required fields
    const requiredFields = ['userId', 'name', 'avatar'];
    for (const field of requiredFields) {
      if (!participantData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create new participant entry
    const newParticipant = {
      id: `part_${Date.now()}`,
      raceId,
      ...participantData,
      status: 'registered',
      joinedAt: new Date().toISOString(),
    };

    // Save participant
    participants.push(newParticipant);

    return NextResponse.json(newParticipant);
  } catch (error) {
    console.error('Error adding participant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    const { participantId, status } = await request.json();

    if (!participantId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: participantId and status' },
        { status: 400 }
      );
    }

    // Find and update participant
    const participantIndex = participants.findIndex(
      p => p.id === participantId && p.raceId === raceId
    );

    if (participantIndex === -1) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }

    participants[participantIndex] = {
      ...participants[participantIndex],
      status,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(participants[participantIndex]);
  } catch (error) {
    console.error('Error updating participant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 