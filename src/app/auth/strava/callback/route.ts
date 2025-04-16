import { NextResponse } from 'next/server';
import { exchangeCodeForToken } from '@/lib/strava';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    console.log('Strava callback received:', {
      code: code ? 'present' : 'missing',
      error,
      errorDescription,
      url: request.url
    });

    if (error) {
      console.error('Strava authorization error:', { error, errorDescription });
      return NextResponse.redirect(new URL('/auth/error?error=' + encodeURIComponent(error), request.url));
    }

    if (!code) {
      console.error('No authorization code received');
      return NextResponse.redirect(new URL('/auth/error?error=no_code', request.url));
    }

    // Exchange the code for an access token
    const tokenResponse = await exchangeCodeForToken(code);
    console.log('Token exchange successful for athlete:', tokenResponse.athlete.id);

    // Get or create the user
    const user = await prisma.user.upsert({
      where: {
        stravaId: tokenResponse.athlete.id.toString(),
      },
      update: {
        stravaAccessToken: tokenResponse.access_token,
        stravaRefreshToken: tokenResponse.refresh_token,
        stravaTokenExpiresAt: new Date(tokenResponse.expires_at * 1000),
      },
      create: {
        stravaId: tokenResponse.athlete.id.toString(),
        name: `${tokenResponse.athlete.firstname} ${tokenResponse.athlete.lastname}`,
        email: `${tokenResponse.athlete.id}@strava.com`, // Placeholder email
        stravaAccessToken: tokenResponse.access_token,
        stravaRefreshToken: tokenResponse.refresh_token,
        stravaTokenExpiresAt: new Date(tokenResponse.expires_at * 1000),
      },
    });

    console.log('User created/updated:', user.id);

    // Create a session for the user
    // TODO: Implement proper session creation

    // Redirect to the dashboard or home page
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Error in Strava callback:', error);
    return NextResponse.redirect(new URL('/auth/error?error=server_error', request.url));
  }
} 