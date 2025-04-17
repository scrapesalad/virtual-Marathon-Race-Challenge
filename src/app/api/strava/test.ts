import { getStravaAuthUrl, exchangeCodeForToken, getStravaActivities } from '@/lib/strava';

async function testStravaIntegration() {
  try {
    // Step 1: Test auth URL generation
    console.log('Testing Strava Auth URL generation...');
    const authUrl = getStravaAuthUrl();
    console.log('Auth URL:', authUrl);
    
    // Step 2: Test token exchange (requires manual code input)
    console.log('\nTo test token exchange:');
    console.log('1. Visit the auth URL above in your browser');
    console.log('2. Authorize the application');
    console.log('3. Copy the "code" parameter from the callback URL');
    console.log('4. Set it as STRAVA_TEST_CODE in your .env file');
    
    const code = process.env.STRAVA_TEST_CODE;
    if (!code) {
      console.log('No test code provided. Skipping token exchange test.');
      return;
    }

    console.log('\nTesting token exchange...');
    const tokenResponse = await exchangeCodeForToken(code);
    console.log('Token exchange successful!');
    console.log('Access token expires at:', new Date(tokenResponse.expires_at * 1000));

    // Step 3: Test activities fetch
    console.log('\nTesting activities fetch...');
    const activities = await getStravaActivities(tokenResponse.access_token);
    console.log(`Successfully fetched ${activities.length} activities!`);
    
    // Print first activity details
    if (activities.length > 0) {
      console.log('\nLatest activity:');
      console.log('- Name:', activities[0].name);
      console.log('- Distance:', activities[0].distance);
      console.log('- Type:', activities[0].type);
      console.log('- Date:', activities[0].start_date);
    }

  } catch (error) {
    console.error('Test failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
  }
}

export async function GET() {
  await testStravaIntegration();
  return new Response('Check the server logs for test results', { status: 200 });
} 