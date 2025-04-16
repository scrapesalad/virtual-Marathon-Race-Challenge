import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

// Mock database for chat messages
let chatMessages: Record<string, any[]> = {};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const raceId = params.id;
    const messages = await prisma.chatMessage.findMany({
      where: { raceId },
      orderBy: { timestamp: 'asc' },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat messages' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const raceId = params.id;
    const { content, type = 'user' } = await request.json();

    // Get user from auth token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const message = await prisma.chatMessage.create({
      data: {
        raceId,
        content,
        type,
        userId: user.id,
        userName: user.name || 'Anonymous',
        userAvatar: user.image || '',
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error posting chat message:', error);
    return NextResponse.json(
      { error: 'Failed to post chat message' },
      { status: 500 }
    );
  }
}

// Helper function to add system messages
export async function addSystemMessage(
  raceId: string,
  content: string,
  type: 'system' | 'achievement' = 'system'
) {
  if (!chatMessages[raceId]) {
    chatMessages[raceId] = [];
  }

  const systemMessage = {
    id: `msg_${Date.now()}`,
    raceId,
    type,
    content,
    timestamp: new Date().toISOString(),
    userId: 'system',
    userName: 'System',
    userAvatar: '',
  };

  chatMessages[raceId].push(systemMessage);

  // In a real app, broadcast message to connected clients via WebSocket
  // await broadcastMessage(raceId, systemMessage);

  return systemMessage;
} 