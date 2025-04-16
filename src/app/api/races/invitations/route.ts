import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mock database for invitations
let invitations: any[] = [];

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const stravaToken = cookieStore.get('strava_access_token');

    if (!stravaToken) {
      return NextResponse.json(
        { error: 'Unauthorized - Please connect your Strava account' },
        { status: 401 }
      );
    }

    const inviteData = await request.json();
    
    // Validate required fields
    const requiredFields = ['raceId', 'inviteeEmail'];
    for (const field of requiredFields) {
      if (!inviteData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create new invitation
    const newInvitation = {
      id: `inv_${Date.now()}`,
      ...inviteData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      invitedBy: 'user_123', // In a real app, get this from the session
    };

    // In a real app, send email to invitee
    // await sendInvitationEmail(newInvitation);

    // Save invitation
    invitations.push(newInvitation);

    return NextResponse.json(newInvitation);
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const raceId = searchParams.get('raceId');
    const email = searchParams.get('email');
    
    let filteredInvitations = [...invitations];

    if (raceId) {
      filteredInvitations = filteredInvitations.filter(inv => inv.raceId === raceId);
    }

    if (email) {
      filteredInvitations = filteredInvitations.filter(inv => inv.inviteeEmail === email);
    }

    return NextResponse.json(filteredInvitations);
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 