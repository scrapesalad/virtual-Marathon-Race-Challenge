import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';
import { ChatMessageType } from '@/types/chat';
import { RateLimiter } from '@/lib/rate-limiter';
import { JsonWebTokenError } from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const MESSAGE_LIMIT = 100;
const rateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 20 // limit each IP to 20 requests per minute
});

export async function GET(request: NextRequest) {
  try {
    const raceId = request.nextUrl.pathname.split('/')[3];
    
    // Validate race exists
    const race = await prisma.race.findUnique({
      where: { id: raceId },
    });

    if (!race) {
      return NextResponse.json(
        { error: 'Race not found' },
        { status: 404 }
      );
    }

    const messages = await prisma.chatMessage.findMany({
      where: { raceId },
      orderBy: { timestamp: 'desc' },
      take: MESSAGE_LIMIT,
    });

    return NextResponse.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await rateLimiter.check(clientIp);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const raceId = request.nextUrl.pathname.split('/')[3];
    const { content, type = 'user' as ChatMessageType } = await request.json();

    // Validate content
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message content cannot be empty' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Message content too long (max 1000 characters)' },
        { status: 400 }
      );
    }

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

    // Validate race exists and user has access
    const race = await prisma.race.findFirst({
      where: {
        id: raceId,
        OR: [
          { userId: user.id },
          { participations: { some: { userId: user.id } } }
        ]
      }
    });

    if (!race) {
      return NextResponse.json(
        { error: 'Race not found or access denied' },
        { status: 404 }
      );
    }

    // Create message with transaction to ensure consistency
    const message = await prisma.$transaction(async (tx) => {
      const messageCount = await tx.chatMessage.count({
        where: { raceId }
      });

      if (messageCount >= MESSAGE_LIMIT) {
        // Delete oldest message if limit reached
        const oldestMessage = await tx.chatMessage.findFirst({
          where: { raceId },
          orderBy: { timestamp: 'asc' }
        });
        if (oldestMessage) {
          await tx.chatMessage.delete({
            where: { id: oldestMessage.id }
          });
        }
      }

      return tx.chatMessage.create({
        data: {
          raceId,
          content,
          type,
          userId: user.id,
          userName: `${user.firstName} ${user.lastName}`,
          userAvatar: user.profileImage,
        },
      });
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error posting chat message:', error);
    if (error instanceof JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }
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
  try {
    const message = await prisma.chatMessage.create({
      data: {
        raceId,
        content,
        type,
        userId: 'system',
        userName: 'System',
        userAvatar: null,
      },
    });

    return message;
  } catch (error) {
    console.error('Error adding system message:', error);
    throw error;
  }
} 