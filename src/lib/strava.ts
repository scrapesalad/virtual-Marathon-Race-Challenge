import { StravaActivity, StravaTokenResponse } from '@/types/strava';

const STRAVA_API_URL = 'https://www.strava.com/api/v3';
const STRAVA_AUTH_URL = 'https://www.strava.com/oauth/token';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export class StravaError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'StravaError';
  }
}

export function getStravaAuthUrl(isTest = false): string {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI;
  const scope = 'read,activity:read_all';

  if (!clientId || !redirectUri) {
    throw new Error(
      'Missing required environment variables for Strava authentication. ' +
      'Please ensure STRAVA_CLIENT_ID and NEXT_PUBLIC_STRAVA_REDIRECT_URI are set.'
    );
  }

  // Validate redirect URI format
  try {
    const url = new URL(redirectUri);
    if (!url.protocol.startsWith('http')) {
      throw new Error('Redirect URI must use HTTP or HTTPS protocol');
    }
  } catch (error) {
    throw new Error(`Invalid redirect URI format: ${redirectUri}`);
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope,
  });

  if (isTest) {
    params.append('test', 'true');
  }

  return `https://www.strava.com/oauth/authorize?${params.toString()}`;
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delayMs = RETRY_DELAY,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries === 0 || !(error instanceof StravaError) || error.status === 401) {
      throw error;
    }
    await delay(delayMs);
    return retryWithBackoff(operation, retries - 1, delayMs * 2);
  }
}

export async function exchangeCodeForToken(code: string): Promise<StravaTokenResponse> {
  return retryWithBackoff(async () => {
    try {
      const response = await fetch(STRAVA_AUTH_URL, {
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

      if (!response.ok) {
        throw new StravaError('Failed to exchange code for token', response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof StravaError) throw error;
      throw new StravaError('Failed to exchange code for token', 500);
    }
  });
}

export async function refreshStravaToken(refreshToken: string): Promise<StravaTokenResponse> {
  return retryWithBackoff(async () => {
    try {
      const response = await fetch(STRAVA_AUTH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.STRAVA_CLIENT_ID,
          client_secret: process.env.STRAVA_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        throw new StravaError('Failed to refresh token', response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof StravaError) throw error;
      throw new StravaError('Failed to refresh token', 500);
    }
  });
}

export async function getActivities(
  accessToken: string,
  page = 1,
  perPage = 30
): Promise<StravaActivity[]> {
  return retryWithBackoff(() => getStravaActivities(accessToken, page, perPage));
}

export async function getStravaActivities(
  accessToken: string,
  page = 1,
  perPage = 30
): Promise<StravaActivity[]> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    const response = await fetch(
      `${STRAVA_API_URL}/athlete/activities?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new StravaError('Failed to fetch activities', response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof StravaError) throw error;
    throw new StravaError('Failed to fetch activities', 500);
  }
}

export async function getStravaActivity(
  accessToken: string,
  activityId: number
): Promise<StravaActivity> {
  return retryWithBackoff(async () => {
    try {
      const response = await fetch(`${STRAVA_API_URL}/activities/${activityId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new StravaError('Failed to fetch activity', response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof StravaError) throw error;
      throw new StravaError('Failed to fetch activity', 500);
    }
  });
}

export async function updateUserToken(userId: string, tokenData: StravaTokenResponse): Promise<void> {
  try {
    const response = await fetch('/api/auth/strava/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, tokenData }),
    });

    if (!response.ok) {
      throw new Error('Failed to update user token');
    }
  } catch (error) {
    console.error('Error updating user token:', error);
    throw error;
  }
}

export async function processActivity(activity: StravaActivity): Promise<void> {
  try {
    const response = await fetch('/api/activities/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activity),
    });

    if (!response.ok) {
      throw new Error('Failed to process activity');
    }
  } catch (error) {
    console.error('Error processing activity:', error);
    throw error;
  }
}

export function calculateTotalDistance(activities: StravaActivity[]): number {
  return activities.reduce((total, activity) => {
    if (activity.type === 'Run') {
      return total + activity.distance;
    }
    return total;
  }, 0);
}

export function calculateTotalElevationGain(activities: StravaActivity[]): number {
  return activities.reduce((total, activity) => {
    if (activity.type === 'Run') {
      return total + activity.total_elevation_gain;
    }
    return total;
  }, 0);
} 