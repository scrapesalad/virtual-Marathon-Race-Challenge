import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('strava_access_token');

    if (!accessToken) {
      return NextResponse.json({ success: false, message: 'No access token found' });
    }

    // Test the token by making a request to the Strava API
    const response = await fetch('https://www.strava.com/api/v3/athlete', {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    });

    if (!response.ok) {
      return NextResponse.json({ success: false, message: 'Invalid access token' });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error testing Strava connection:', error);
    return NextResponse.json({ success: false, message: 'Error testing connection' });
  }
} 