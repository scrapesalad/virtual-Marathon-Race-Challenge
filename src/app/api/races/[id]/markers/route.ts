import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, coordinates, type } = await request.json();

    if (!title || !description || !coordinates || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const race = await prisma.race.findUnique({
      where: { id: params.id },
      include: { markers: true },
    });

    if (!race) {
      return NextResponse.json({ error: 'Race not found' }, { status: 404 });
    }

    const marker = await prisma.routeMarker.create({
      data: {
        title,
        description,
        coordinates,
        type,
        raceId: params.id,
      },
    });

    return NextResponse.json(marker);
  } catch (error) {
    console.error('Error creating marker:', error);
    return NextResponse.json(
      { error: 'Failed to create marker' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const markers = await prisma.routeMarker.findMany({
      where: { raceId: params.id },
    });

    return NextResponse.json(markers);
  } catch (error) {
    console.error('Error fetching markers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch markers' },
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
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { markerId } = await request.json();

    if (!markerId) {
      return NextResponse.json(
        { error: 'Marker ID is required' },
        { status: 400 }
      );
    }

    await prisma.routeMarker.delete({
      where: { id: markerId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting marker:', error);
    return NextResponse.json(
      { error: 'Failed to delete marker' },
      { status: 500 }
    );
  }
} 