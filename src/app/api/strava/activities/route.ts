import { NextResponse } from 'next/server';
import { getActivities, StravaError } from '@/lib/strava';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function GET(request: Request) {
  try {
    // Get the JWT token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    if (!payload.sub) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('per_page') || '30', 10);

    // Fetch activities using the improved token management
    const activities = await getActivities(payload.sub as string, page, perPage);

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Error fetching Strava activities:', error);

    if (error instanceof StravaError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
} 