import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { exchangeCodeForToken } from '@/lib/strava';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    const userAgent = request.headers.get('user-agent') || '';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTest = searchParams.get('test') === 'true';

    // Log the request details for debugging
    console.log('Strava callback received:', {
      code: code ? 'present' : 'missing',
      error,
      errorDescription,
      isMobile,
      isTest,
      url: request.url
    });

    // Handle Strava errors
    if (error) {
      console.error('Strava authorization error:', { error, errorDescription });
      const errorUrl = isTest 
        ? `/strava-test?error=${encodeURIComponent(errorDescription || error)}`
        : `/auth/signin?error=${encodeURIComponent(errorDescription || error)}`;
      return NextResponse.redirect(new URL(errorUrl, request.url));
    }

    // Handle missing code
    if (!code) {
      const error = 'No authorization code received';
      console.error(error);
      const errorUrl = isTest
        ? `/strava-test?error=${encodeURIComponent(error)}`
        : `/auth/signin?error=${encodeURIComponent(error)}`;
      return NextResponse.redirect(new URL(errorUrl, request.url));
    }

    // Exchange the code for tokens
    const tokenData = await exchangeCodeForToken(code);

    // Create response with appropriate redirect
    const successUrl = isTest ? '/strava-test?success=true' : '/dashboard';
    const response = NextResponse.redirect(new URL(successUrl, request.url));

    // Set cookies in the response
    response.cookies.set('strava_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(tokenData.expires_at * 1000),
    });

    response.cookies.set('strava_refresh_token', tokenData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    try {
      // Create or update user in database
      await prisma.user.upsert({
        where: { 
          stravaId: tokenData.athlete.id.toString()
        },
        update: {
          stravaAccessToken: tokenData.access_token,
          stravaRefreshToken: tokenData.refresh_token,
          stravaTokenExpiresAt: new Date(tokenData.expires_at * 1000),
          firstName: tokenData.athlete.firstname,
          lastName: tokenData.athlete.lastname,
          email: tokenData.athlete.email || `${tokenData.athlete.id}@strava.com`,
        },
        create: {
          stravaId: tokenData.athlete.id.toString(),
          stravaAccessToken: tokenData.access_token,
          stravaRefreshToken: tokenData.refresh_token,
          stravaTokenExpiresAt: new Date(tokenData.expires_at * 1000),
          firstName: tokenData.athlete.firstname,
          lastName: tokenData.athlete.lastname,
          email: tokenData.athlete.email || `${tokenData.athlete.id}@strava.com`,
        },
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Even if database update fails, we can still proceed with the auth flow
      // but we should log the error for monitoring
    }

    return response;
  } catch (error) {
    console.error('Error in Strava callback:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const errorUrl = searchParams.get('test') === 'true'
      ? `/strava-test?error=${encodeURIComponent(errorMessage)}`
      : `/auth/signin?error=${encodeURIComponent(errorMessage)}`;
    return NextResponse.redirect(new URL(errorUrl, request.url));
  }
} 