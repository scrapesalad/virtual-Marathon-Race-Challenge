import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('Error from Strava:', error);
      return NextResponse.redirect('/connect-tracker?error=strava_auth_failed');
    }

    if (!code) {
      console.error('No authorization code received');
      return NextResponse.redirect('/connect-tracker?error=no_code');
    }

    const response = await fetch(STRAVA_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error exchanging token:', data);
      return NextResponse.redirect('/connect-tracker?error=token_exchange_failed');
    }

    const { access_token, refresh_token, expires_at } = data;

    // Set cookies with the tokens
    const cookieStore = await cookies();
    
    // Access token cookie - expires when the token expires
    cookieStore.set('strava_access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(expires_at * 1000),
    });

    // Refresh token cookie - long lived
    cookieStore.set('strava_refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Redirect to dashboard on success
    return NextResponse.redirect('/dashboard');
  } catch (error) {
    console.error('Error in Strava auth:', error);
    return NextResponse.redirect('/connect-tracker?error=server_error');
  }
}

// Handle POST requests for token refresh
export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    const response = await fetch(STRAVA_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || 'Failed to exchange token' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in Strava auth:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 