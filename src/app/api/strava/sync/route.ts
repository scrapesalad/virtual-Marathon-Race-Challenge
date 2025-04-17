import { NextResponse } from 'next/server';
import { syncStravaActivities } from '@/lib/strava-sync';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await syncStravaActivities(session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error syncing Strava activities:', error);
    return NextResponse.json(
      { error: 'Failed to sync activities' },
      { status: 500 }
    );
  }
}

// Also handle GET requests to support webhook verification
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Verify webhook
  if (mode === 'subscribe' && token === process.env.STRAVA_WEBHOOK_VERIFY_TOKEN) {
    return NextResponse.json({ 'hub.challenge': challenge });
  }

  return NextResponse.json({ error: 'Invalid verification token' }, { status: 403 });
} 