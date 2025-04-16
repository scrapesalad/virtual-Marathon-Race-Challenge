'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { isMobile } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/Alert';

export default function StravaConnection() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Listen for messages from the Strava callback
    const handleMessage = (event: MessageEvent) => {
      if (event.data.success) {
        setSuccess('Successfully connected to Strava!');
        setError(null);
        router.refresh();
      } else if (event.data.error) {
        setError(event.data.error);
        setSuccess(null);
      }
      setIsConnecting(false);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router]);

  const handleReauthorize = async () => {
    setIsConnecting(true);
    setError(null);
    setSuccess(null);

    try {
      const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
      const redirectUri = isMobile() 
        ? process.env.NEXT_PUBLIC_STRAVA_MOBILE_REDIRECT_URI 
        : process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI;
      
      // Request specific scopes needed for the application
      const scope = 'read,activity:read_all,profile:read_all,read_all';

      if (!clientId || !redirectUri) {
        throw new Error('Strava configuration is missing. Please check your environment variables.');
      }

      const mobile = isMobile();
      const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&approval_prompt=force`;

      if (mobile) {
        // For mobile, we'll redirect in the same window
        window.location.href = authUrl;
      } else {
        // For desktop, open in a popup
        const width = 600;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const popup = window.open(
          authUrl,
          'Strava Authorization',
          `width=${width},height=${height},left=${left},top=${top}`
        );

        if (!popup) {
          setError('Please allow popups for this site to connect with Strava');
          setIsConnecting(false);
          return;
        }

        // Listen for the popup to close
        const checkPopup = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkPopup);
            setIsConnecting(false);
            router.refresh();
          }
        }, 1000);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to connect to Strava');
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      <Button
        onClick={handleReauthorize}
        disabled={isConnecting}
        className="w-full"
      >
        {isConnecting ? 'Connecting...' : 'Connect with Strava'}
      </Button>
    </div>
  );
} 