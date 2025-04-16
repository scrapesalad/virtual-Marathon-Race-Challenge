import { cookies } from 'next/headers';

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;

export async function refreshStravaToken(refreshToken: string) {
  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  return response.json();
}

export async function getStravaAthlete(accessToken: string) {
  const response = await fetch('https://www.strava.com/api/v3/athlete', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch athlete data');
  }

  return response.json();
}

export async function getStravaActivities(accessToken: string, after?: number) {
  const params = new URLSearchParams();
  if (after) {
    params.append('after', after.toString());
  }
  params.append('per_page', '30');

  const response = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch activities');
  }

  return response.json();
}

export async function getStravaActivity(accessToken: string, activityId: number) {
  const response = await fetch(
    `https://www.strava.com/api/v3/activities/${activityId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch activity');
  }

  return response.json();
}

export async function getStravaActivityStream(
  accessToken: string,
  activityId: number,
  types: string[]
) {
  const params = new URLSearchParams();
  params.append('keys', types.join(','));
  params.append('key_by_type', 'true');

  const response = await fetch(
    `https://www.strava.com/api/v3/activities/${activityId}/streams?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch activity stream');
  }

  return response.json();
} 