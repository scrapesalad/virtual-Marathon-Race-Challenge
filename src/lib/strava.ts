// Strava API client for fetching activities and handling authentication

import strava from 'strava-v3';
import { prisma } from './prisma';

// Strava API endpoints
const STRAVA_API_URL = 'https://www.strava.com/api/v3';
const STRAVA_AUTH_URL = 'https://www.strava.com/oauth/token';

// Strava API credentials - these should be stored in environment variables
// For development, we're using placeholder values
const STRAVA_CLIENT_ID = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID || '154834';
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET || 'b8bcab3bd7fb86e420d96a86803591b5ee2a0c95';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const REDIRECT_URI = `${APP_URL}/auth/strava/callback`;

// Types for Strava API responses
export interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  start_date: string;
  start_date_local: string;
  map: {
    id: string;
    summary_polyline: string;
    polyline: string;
  };
  average_speed: number;
  max_speed: number;
  average_heartrate?: number;
  max_heartrate?: number;
  start_latlng?: [number, number];
  end_latlng?: [number, number];
}

export interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete: {
    id: number;
    firstname: string;
    lastname: string;
    profile: string;
  };
}

// Error handling
export class StravaError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorCode?: string
  ) {
    super(message);
    this.name = 'StravaError';
  }
}

// Strava API configuration
export const stravaConfig = {
  client_id: process.env.STRAVA_CLIENT_ID,
  client_secret: process.env.STRAVA_CLIENT_SECRET,
  redirect_uri: process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI,
};

// Function to get the authorization URL for Strava OAuth
export function getStravaAuthUrl(): string {
  const scope = 'read,activity:read';
  const mobile = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Use a more mobile-friendly URL if on mobile
  const authUrl = mobile 
    ? `https://www.strava.com/oauth/mobile/authorize`
    : `https://www.strava.com/oauth/authorize`;

  const params = new URLSearchParams({
    client_id: STRAVA_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: scope,
    approval_prompt: 'force'
  });

  return `${authUrl}?${params.toString()}`;
}

// Token management
export async function refreshToken(userId: string): Promise<string> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        stravaRefreshToken: true,
        stravaTokenExpiresAt: true,
      },
    });

    if (!user?.stravaRefreshToken) {
      throw new StravaError('No refresh token found', 401);
    }

    // Check if token needs refresh
    if (user.stravaTokenExpiresAt && user.stravaTokenExpiresAt > new Date()) {
      return user.stravaRefreshToken;
    }

    const response = await fetch(STRAVA_AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        refresh_token: user.stravaRefreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new StravaError('Failed to refresh token', response.status);
    }

    const data = await response.json();
    
    // Update user with new tokens
    await prisma.user.update({
      where: { id: userId },
      data: {
        stravaAccessToken: data.access_token,
        stravaRefreshToken: data.refresh_token,
        stravaTokenExpiresAt: new Date(data.expires_at * 1000),
      },
    });

    return data.access_token;
  } catch (error) {
    if (error instanceof StravaError) {
      throw error;
    }
    throw new StravaError('Failed to refresh token', 500);
  }
}

// Activity fetching
export async function getActivities(userId: string, page = 1, perPage = 30): Promise<StravaActivity[]> {
  try {
    const accessToken = await refreshToken(userId);
    
    const response = await fetch(
      `${STRAVA_API_URL}/athlete/activities?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new StravaError('Failed to fetch activities', response.status);
    }

    return response.json();
  } catch (error) {
    if (error instanceof StravaError) {
      throw error;
    }
    throw new StravaError('Failed to fetch activities', 500);
  }
}

// Exchange code for token
export async function exchangeCodeForToken(code: string): Promise<StravaTokenResponse> {
  try {
    const response = await fetch(STRAVA_AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new StravaError(
        error.message || 'Failed to exchange code for token',
        response.status,
        error.error
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof StravaError) {
      throw error;
    }
    throw new StravaError('Failed to exchange code for token', 500);
  }
}

// Function to fetch a specific activity
export async function getActivity(accessToken: string, activityId: number): Promise<StravaActivity> {
  const response = await fetch(`${STRAVA_API_URL}/activities/${activityId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch activity: ${response.statusText}`);
  }

  return response.json();
}

// Get user's running activities
export async function getRuns(accessToken: string): Promise<StravaActivity[]> {
  try {
    const response = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=30', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const activities = await response.json();
    return activities.filter((act: StravaActivity) => act.type === 'Run');
  } catch (error) {
    console.error('Error fetching Strava activities:', error);
    throw error;
  }
}

// Calculate total distance from activities in kilometers
export function calculateTotalDistance(activities: StravaActivity[]): number {
  return activities.reduce((total, activity) => {
    return total + (activity.distance / 1000); // Convert meters to kilometers
  }, 0);
}

// Calculate average pace from activities in min/km
export function calculateAveragePace(activities: StravaActivity[]): number {
  if (!activities.length) return 0;
  
  const totalTime = activities.reduce((sum, activity) => sum + activity.moving_time, 0);
  const totalDistance = activities.reduce((sum, activity) => sum + activity.distance, 0);
  
  // Calculate pace in seconds per meter, then convert to minutes per kilometer
  const paceSecondsPerMeter = totalTime / totalDistance;
  const paceMinutesPerKm = (paceSecondsPerMeter * 1000) / 60;
  
  return paceMinutesPerKm;
}

// Calculate estimated time left based on current pace and remaining distance
export function calculateTimeLeft(totalDistance: number, completedDistance: number, activities: StravaActivity[]): number {
  const remainingDistance = totalDistance - completedDistance;
  if (remainingDistance <= 0) return 0;
  
  const averagePace = calculateAveragePace(activities);
  if (!averagePace) return 0;
  
  // Return estimated minutes to complete remaining distance
  return averagePace * remainingDistance;
}

// Format pace to mm:ss format
export function formatPace(paceMinutesPerKm: number): string {
  const minutes = Math.floor(paceMinutesPerKm);
  const seconds = Math.round((paceMinutesPerKm - minutes) * 60);
  return `${minutes}'${seconds.toString().padStart(2, '0')}"`;
}

// Format time to hours and minutes
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  
  if (hours === 0) {
    return `${remainingMinutes} min`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}

export function calculatePosition(
  completedDistance: number,
  allParticipants: { id: string; completedDistance: number }[]
): number {
  // Sort participants by completed distance (descending)
  const sortedParticipants = [...allParticipants].sort((a, b) => 
    b.completedDistance - a.completedDistance
  );
  
  // Find position (1-based index)
  for (let i = 0; i < sortedParticipants.length; i++) {
    if (completedDistance >= sortedParticipants[i].completedDistance) {
      return i + 1;
    }
  }
  
  // If not found (shouldn't happen), return last position
  return sortedParticipants.length;
}

export async function getStravaActivity(activityId: number, accessToken: string): Promise<StravaActivity> {
  const response = await fetch(`https://www.strava.com/api/v3/activities/${activityId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch activity: ${response.statusText}`);
  }

  return response.json();
}

export async function updateUserToken(userId: string): Promise<string> {
  // TODO: Implement token refresh logic using the refresh token
  // This should:
  // 1. Check if the current token is expired
  // 2. If expired, use refresh token to get a new access token
  // 3. Update the database with the new tokens
  // 4. Return the valid access token
  return '';
}

export async function processActivity(activity: StravaActivity, userId: string) {
  // TODO: Implement activity processing logic
  // This should:
  // 1. Find active races for the user
  // 2. Update progress for matching races
  // 3. Update user statistics
  // 4. Generate achievements if applicable
} 