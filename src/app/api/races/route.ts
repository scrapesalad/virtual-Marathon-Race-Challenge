import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Race {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  type: string;
  targetDistance: number;
  isPrivate: boolean;
  createdBy: string;
  createdAt: Date;
  _count: {
    participants: number;
  };
}

export async function GET() {
  try {
    const races = await prisma.race.findMany({
      include: {
        _count: {
          select: {
            participants: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedRaces = races.map((race: Race) => ({
      id: race.id,
      name: race.name,
      description: race.description,
      startDate: race.startDate.toISOString(),
      endDate: race.endDate.toISOString(),
      type: race.type,
      targetDistance: race.targetDistance,
      participantCount: race._count.participants,
      isPrivate: race.isPrivate,
      createdBy: race.createdBy,
      createdAt: race.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedRaces);
  } catch (error) {
    console.error('Error fetching races:', error);
    return NextResponse.json(
      { message: 'Failed to fetch races' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser | undefined;

    if (!user?.id) {
      return NextResponse.json(
        { message: 'You must be logged in to create a race' },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'description', 'startDate', 'endDate', 'type', 'targetDistance'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Create race
    const race = await prisma.race.create({
      data: {
        name: data.name,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        distance: parseFloat(data.targetDistance),
        userId: user.id,
        imageUrl: data.imageUrl || null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
    });

    return NextResponse.json(race);
  } catch (error) {
    console.error('Error creating race:', error);
    return NextResponse.json(
      { message: 'Failed to create race' },
      { status: 500 }
    );
  }
} 