import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStravaActivity, processActivity, updateUserToken } from '@/lib/strava';

// Verify webhook subscription from Strava
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Verify that this is a valid subscription request from Strava
  if (mode === 'subscribe' && token === process.env.STRAVA_WEBHOOK_VERIFY_TOKEN) {
    console.log('Webhook verified successfully');
    return NextResponse.json({ 'hub.challenge': challenge });
  } else {
    console.error('Failed to verify webhook');
    return new NextResponse('Invalid verification token', { status: 403 });
  }
}

interface StravaWebhookEvent {
  object_type: 'activity' | 'athlete';
  aspect_type: 'create' | 'update' | 'delete';
  object_id: number;
  owner_id: number;
  subscription_id: number;
  event_time: number;
  updates?: {
    title?: string;
    type?: string;
    private?: boolean;
    distance?: number;
  };
}

// Handle webhook events from Strava
export async function POST(request: Request) {
  try {
    const body: StravaWebhookEvent = await request.json();
    
    // Log the webhook event for debugging
    console.log('Received Strava webhook:', body);

    const { object_type, aspect_type, object_id, owner_id, updates } = body;

    // Handle different types of events
    if (object_type === 'activity') {
      // Find the user by their Strava ID
      const user = await prisma.user.findFirst({
        where: {
          stravaId: owner_id.toString()
        }
      });

      if (!user) {
        console.error('User not found for Strava ID:', owner_id);
        return new NextResponse('User not found', { status: 404 });
      }

      if (aspect_type === 'create') {
        try {
          // Get a fresh access token
          const accessToken = await updateUserToken(user.id);
          
          // Fetch activity details
          const activity = await getStravaActivity(object_id, accessToken);
          
          // Process the activity
          await processActivity(activity, user.id);
          
          console.log('Successfully processed new activity:', object_id);
        } catch (error) {
          console.error('Error processing activity:', error);
          return new NextResponse('Error processing activity', { status: 500 });
        }
      } else if (aspect_type === 'update') {
        // Handle activity update
        console.log('Activity updated:', object_id, updates);
        // TODO: Implement update handling if needed
      } else if (aspect_type === 'delete') {
        // Handle activity deletion
        console.log('Activity deleted:', object_id);
        // TODO: Implement deletion handling if needed
      }
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 