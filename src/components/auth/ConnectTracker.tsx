'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { LoginButton } from './LoginButton';
import Link from 'next/link';

export function ConnectTracker() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleStravaConnect = () => {
    setIsConnecting(true);
    const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
    // Get the current hostname (localhost:3000 in development, your domain in production)
    const hostname = window.location.origin;
    const redirectUri = `${hostname}/api/strava/auth`;
    const scope = 'read,activity:read_all,profile:read_all';
    
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`;
    
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Connect your fitness tracker
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Connect your Strava account to automatically track your activities
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">⌚</span>
              </div>
              <p className="text-center text-gray-600 dark:text-gray-400">
                Connect your Strava account to automatically track your activities and progress in virtual races.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                variant="primary"
                fullWidth
                onClick={handleStravaConnect}
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting...' : 'Connect with Strava'}
              </Button>
              
              <div className="text-center">
                <Link href="/dashboard" className="text-sm text-orange-600 hover:text-orange-500">
                  Skip for now
                </Link>
              </div>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Or sign in with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <LoginButton />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 