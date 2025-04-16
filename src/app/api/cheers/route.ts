import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userRaceId = searchParams.get('userRaceId');

  if (!userRaceId) {
    return NextResponse.json({ error: 'Missing userRaceId' }, { status: 400 });
  }

  try {
    const cheers = await prisma.cheer.findMany({
      where: {
        userRaceId,
      },
      orderBy: {
        milestone: 'asc',
      },
    });

    return NextResponse.json(cheers);
  } catch (error) {
    console.error('Error fetching cheers:', error);
    return NextResponse.json({ error: 'Failed to fetch cheers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const message = formData.get('message') as string;
    const milestone = parseFloat(formData.get('milestone') as string);
    const userRaceId = formData.get('userRaceId') as string;
    const audioFile = formData.get('audio') as File;

    if (!message || !milestone || !userRaceId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let audioUrl: string | undefined;

    if (audioFile) {
      // Here you would typically:
      // 1. Upload the audio file to a storage service (e.g., AWS S3)
      // 2. Get the URL of the uploaded file
      // For now, we'll skip this part and just note that it needs to be implemented
      console.log('Audio file received, but storage not implemented yet');
    }

    const cheer = await prisma.cheer.create({
      data: {
        message,
        milestone,
        userRaceId,
        audioUrl,
        senderId: session.user?.id,
        senderName: session.user?.name || undefined,
        isPublic: true,
      },
    });

    return NextResponse.json(cheer);
  } catch (error) {
    console.error('Error creating cheer:', error);
    return NextResponse.json({ error: 'Failed to create cheer' }, { status: 500 });
  }
} 