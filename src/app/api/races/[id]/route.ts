import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Mock database for races (in a real app, this would be a database)
let races: any[] = [];

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const raceId = params.id;
    const race = races.find(r => r.id === raceId);

    if (!race) {
      return NextResponse.json(
        { error: 'Race not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(race);
  } catch (error) {
    console.error('Error fetching race:', error);
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
    const updateData = await request.json();

    // Find race index
    const raceIndex = races.findIndex(r => r.id === raceId);

    if (raceIndex === -1) {
      return NextResponse.json(
        { error: 'Race not found' },
        { status: 404 }
      );
    }

    // Validate status transitions
    if (updateData.status) {
      const currentStatus = races[raceIndex].status;
      const newStatus = updateData.status;

      const validTransitions: Record<string, string[]> = {
        scheduled: ['in_progress', 'cancelled'],
        in_progress: ['completed', 'cancelled'],
        completed: [],
        cancelled: [],
      };

      if (!validTransitions[currentStatus]?.includes(newStatus)) {
        return NextResponse.json(
          { error: `Invalid status transition from ${currentStatus} to ${newStatus}` },
          { status: 400 }
        );
      }
    }

    // Update race
    races[raceIndex] = {
      ...races[raceIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(races[raceIndex]);
  } catch (error) {
    console.error('Error updating race:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser | undefined;

    if (!user?.id) {
      return NextResponse.json(
        { message: 'You must be logged in to update a race' },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Check if race exists and user is the creator
    const existingRace = await prisma.race.findUnique({
      where: { id: params.id },
      select: { createdBy: true },
    });

    if (!existingRace) {
      return NextResponse.json(
        { message: 'Race not found' },
        { status: 404 }
      );
    }

    if (existingRace.createdBy !== user.id) {
      return NextResponse.json(
        { message: 'You can only update races you created' },
        { status: 403 }
      );
    }

    // Update race
    const race = await prisma.race.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        location: data.location,
        distance: parseFloat(data.distance),
        elevationGain: parseFloat(data.elevationGain),
        difficulty: data.difficulty,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
      include: {
        route: true,
      },
    });

    return NextResponse.json(race);
  } catch (error) {
    console.error('Error updating race:', error);
    return NextResponse.json(
      { message: 'Failed to update race' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser | undefined;

    if (!user?.id) {
      return NextResponse.json(
        { message: 'You must be logged in to delete a race' },
        { status: 401 }
      );
    }

    // Check if race exists and user is the creator
    const existingRace = await prisma.race.findUnique({
      where: { id: params.id },
      select: { createdBy: true },
    });

    if (!existingRace) {
      return NextResponse.json(
        { message: 'Race not found' },
        { status: 404 }
      );
    }

    if (existingRace.createdBy !== user.id) {
      return NextResponse.json(
        { message: 'You can only delete races you created' },
        { status: 403 }
      );
    }

    // Delete race
    await prisma.race.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Race deleted successfully' });
  } catch (error) {
    console.error('Error deleting race:', error);
    return NextResponse.json(
      { message: 'Failed to delete race' },
      { status: 500 }
    );
  }
} 