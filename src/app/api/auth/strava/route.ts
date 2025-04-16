import { NextResponse } from 'next/server';

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/strava/callback';

export async function GET() {
  if (!STRAVA_CLIENT_ID) {
    return NextResponse.json(
      { error: 'Strava client ID not configured' },
      { status: 500 }
    );
  }

  const authUrl = new URL('https://www.strava.com/oauth/authorize');
  authUrl.searchParams.append('client_id', STRAVA_CLIENT_ID);
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', 'read,activity:read');

  return NextResponse.redirect(authUrl.toString());
} 