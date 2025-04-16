import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    try {
      const payload = verifyToken(token);
      const { email } = payload;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      if (user.emailVerified) {
        return NextResponse.json(
          { error: 'Email already verified' },
          { status: 400 }
        );
      }

      await prisma.user.update({
        where: { email },
        data: { emailVerified: new Date() },
      });

      return NextResponse.json(
        { message: 'Email verified successfully' },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 