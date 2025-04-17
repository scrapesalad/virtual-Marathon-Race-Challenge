import { prisma } from '@/lib/prisma';
import { getStravaActivities, refreshStravaToken } from '@/lib/strava';
import { addHours, isAfter, subHours } from 'date-fns';
import { Activity, Race, User } from '@prisma/client';

// Rate limits from your Strava app settings
const RATE_LIMIT = {
  REQUESTS_PER_15_MIN: 100,
  DAILY_REQUESTS: 1000,
};

interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  start_date: string;
  type: string;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  average_speed: number;
  max_speed: number;
  start_latlng?: [number, number];
  end_latlng?: [number, number];
  average_heartrate?: number;
  max_heartrate?: number;
}

export async function syncStravaActivities(userId: string): Promise<void> {
  try {
    // Get user with Strava credentials
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        races: true
      }
    });

    if (!user || !user.stravaAccessToken || !user.stravaRefreshToken) {
      throw new Error('User not found or Strava not connected');
    }

    // Check if token needs refresh
    if (user.stravaTokenExpiresAt && isAfter(new Date(), user.stravaTokenExpiresAt)) {
      const newToken = await refreshStravaToken(user.stravaRefreshToken);
      await prisma.user.update({
        where: { id: userId },
        data: {
          stravaAccessToken: newToken.access_token,
          stravaRefreshToken: newToken.refresh_token,
          stravaTokenExpiresAt: new Date(newToken.expires_at * 1000),
        },
      });
      user.stravaAccessToken = newToken.access_token;
    }

    // Get last sync time
    const lastSync = await prisma.activity.findFirst({
      where: { userId },
      orderBy: { startDate: 'desc' }
    });

    const since = lastSync ? lastSync.startDate : subHours(new Date(), 24);

    // Fetch new activities from Strava
    const activities = await getStravaActivities(user.stravaAccessToken);
    
    // Filter activities that are relevant to active races
    const relevantActivities = activities.filter((activity: StravaActivity) => {
      const activityDate = new Date(activity.start_date);
      return user.races.some(race => 
        activityDate >= race.startDate && 
        activityDate <= race.endDate &&
        (activity.type === 'Run' || activity.type === 'Walk')
      );
    });

    // Update race progress for each activity
    for (const activity of relevantActivities) {
      const activityDate = new Date(activity.start_date);

      // Check if activity already exists
      const existingActivity = await prisma.activity.findUnique({
        where: { stravaActivityId: activity.id.toString() }
      });

      if (!existingActivity) {
        // For each applicable race, update progress and create activity
        for (const race of user.races) {
          if (activityDate >= race.startDate && activityDate <= race.endDate) {
            await prisma.$transaction([
              // Create activity record
              prisma.activity.create({
                data: {
                  stravaActivityId: activity.id.toString(),
                  name: activity.name,
                  type: activity.type,
                  distance: activity.distance,
                  startDate: activityDate,
                  movingTime: activity.moving_time,
                  elapsedTime: activity.elapsed_time,
                  elevationGain: activity.total_elevation_gain,
                  averageSpeed: activity.average_speed,
                  maxSpeed: activity.max_speed,
                  averageHeartrate: activity.average_heartrate,
                  maxHeartrate: activity.max_heartrate,
                  startLatlng: activity.start_latlng,
                  endLatlng: activity.end_latlng,
                  user: {
                    connect: { id: userId }
                  },
                  race: {
                    connect: { id: race.id }
                  }
                }
              }),
              // Create activity sync record
              prisma.activitySync.create({
                data: {
                  userId,
                  syncedAt: new Date(),
                  activitiesCount: 1
                }
              })
            ]);
          }
        }
      }
    }

  } catch (error) {
    console.error('Error syncing Strava activities:', error);
    throw error;
  }
}