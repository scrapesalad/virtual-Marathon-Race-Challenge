import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { exchangeCodeForToken } from '@/lib/strava';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const userAgent = request.headers.get('user-agent') || '';

    // Check for errors from Strava
    if (error) {
      console.error('Strava authorization error:', error);
      return NextResponse.redirect(new URL('/login?error=strava_auth_failed', request.url));
    }

    if (!code) {
      console.error('No authorization code received');
      return NextResponse.redirect(new URL('/login?error=no_code', request.url));
    }

    // Exchange code for token
    const tokenData = await exchangeCodeForToken(code);
    if (!tokenData) {
      console.error('Failed to exchange code for token');
      return NextResponse.redirect(new URL('/login?error=token_exchange_failed', request.url));
    }

    // Find or create user
    const user = await prisma.user.upsert({
      where: { stravaId: tokenData.athlete.id.toString() },
      update: {
        stravaAccessToken: tokenData.access_token,
        stravaRefreshToken: tokenData.refresh_token,
        stravaTokenExpiresAt: new Date(tokenData.expires_at * 1000),
        stravaId: tokenData.athlete.id.toString(),
        firstName: tokenData.athlete.firstname,
        lastName: tokenData.athlete.lastname,
        profileImage: tokenData.athlete.profile,
        emailVerified: true,
      },
      create: {
        stravaId: tokenData.athlete.id.toString(),
        stravaAccessToken: tokenData.access_token,
        stravaRefreshToken: tokenData.refresh_token,
        stravaTokenExpiresAt: new Date(tokenData.expires_at * 1000),
        firstName: tokenData.athlete.firstname,
        lastName: tokenData.athlete.lastname,
        profileImage: tokenData.athlete.profile,
        emailVerified: true,
      },
    });

    // Create JWT token
    const token = await new SignJWT({ sub: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    // Set cookie
    const cookieStore = cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Check if request is from a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

    if (isMobile) {
      // For mobile, return HTML that closes the popup and redirects
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Strava Authorization Complete</title>
            <script>
              window.opener.postMessage({ type: 'STRAVA_AUTH_COMPLETE' }, '*');
              window.close();
            </script>
          </head>
          <body>
            <p>Authorization complete. You can close this window.</p>
          </body>
        </html>
      `, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }

    // For desktop, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Error in Strava callback:', error);
    return NextResponse.redirect(new URL('/login?error=strava_callback_failed', request.url));
  }
} 