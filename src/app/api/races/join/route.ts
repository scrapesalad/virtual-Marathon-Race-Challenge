import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser | undefined;
    
    if (!user?.id) {
      return NextResponse.json(
        { message: 'You must be logged in to join a race' },
        { status: 401 }
      );
    }

    const { raceId } = await request.json();

    if (!raceId) {
      return NextResponse.json(
        { message: 'Race ID is required' },
        { status: 400 }
      );
    }

    // Check if user is already a participant
    const existingParticipation = await prisma.participation.findUnique({
      where: {
        userId_raceId: {
          userId: user.id,
          raceId: raceId
        }
      }
    });

    if (existingParticipation) {
      return NextResponse.json(
        { message: 'You are already registered for this race' },
        { status: 400 }
      );
    }

    // Add user as participant
    await prisma.participation.create({
      data: {
        userId: user.id,
        raceId: raceId,
        status: 'registered'
      },
    });

    // Create a UserRace entry to track progress
    await prisma.userRace.create({
      data: {
        userId: user.id,
        raceId: raceId,
        progress: 0,
        completed: false
      }
    });

    return NextResponse.json(
      { message: 'Successfully joined the race' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error joining race:', error);
    return NextResponse.json(
      { message: 'Failed to join race' },
      { status: 500 }
    );
  }
} 