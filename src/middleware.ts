import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token';

export async function middleware(request: NextRequest) {
  // Skip middleware for public routes
  const publicRoutes = [
    '/login',
    '/sign-up',
    '/api',
    '/_next',
    '/favicon.ico',
    '/images',
    '/strava-logo.svg'
  ];

  if (publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('strava_access_token');
  const refreshToken = request.cookies.get('strava_refresh_token');

  // If no tokens are present, redirect to login
  if (!accessToken && !refreshToken) {
    const loginUrl = new URL('/login', request.url);
    // Preserve the original URL for redirect after login
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If access token is present but refresh token is not, redirect to login
  if (accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If only refresh token is present, try to get a new access token
  if (!accessToken && refreshToken) {
    try {
      const response = await fetch(STRAVA_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.STRAVA_CLIENT_ID,
          client_secret: process.env.STRAVA_CLIENT_SECRET,
          refresh_token: refreshToken.value,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        // If refresh fails, redirect to login
        return NextResponse.redirect(new URL('/login', request.url));
      }

      const data = await response.json();
      const { access_token, expires_at } = data;

      // Create response with new access token
      const res = NextResponse.next();
      res.cookies.set('strava_access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(expires_at * 1000),
      });

      return res;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Get the origin from the request headers
  const origin = request.headers.get('origin') || '';
  
  // Get allowed origins from environment variable
  const allowedOrigins = process.env.NEXT_PUBLIC_ALLOWED_ORIGINS?.split(',') || [];
  
  // Check if the origin is allowed
  const isAllowedOrigin = allowedOrigins.includes(origin) || origin.startsWith('capacitor://');

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }

  // Get the response
  const response = NextResponse.next();

  // Add CORS headers for allowed origins
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 