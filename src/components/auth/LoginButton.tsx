'use client';

import { Button } from '../ui/Button';

export function LoginButton() {
  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
    const redirectUri = `${window.location.origin}/api/auth/strava/callback`;
    const scope = 'read,activity:read';
    
    const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    
    window.location.href = stravaAuthUrl;
  };

  return (
    <Button onClick={handleLogin}>
      Connect with Strava
    </Button>
  );
} 