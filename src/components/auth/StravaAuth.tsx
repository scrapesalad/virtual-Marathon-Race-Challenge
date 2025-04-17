'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function StravaAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Handle error from URL parameters
    const urlError = searchParams.get('error');
    if (urlError) {
      setError(decodeURIComponent(urlError));
      // Redirect to login page after a short delay to show the error
      setTimeout(() => {
        router.push('/auth/signin');
      }, 3000);
    }
  }, [searchParams, router]);

  useEffect(() => {
    // Handle the message from the popup window
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'STRAVA_AUTH_COMPLETE') {
        router.push('/dashboard');
      } else if (event.data.error) {
        setError(event.data.error);
        setIsLoading(false);
        // Redirect to login page after a short delay to show the error
        setTimeout(() => {
          router.push('/auth/signin');
        }, 3000);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router]);

  const handleStravaAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
      // Check if running on a mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Use the appropriate redirect URI based on device type
      const redirectUri = encodeURIComponent(
        isMobile 
          ? process.env.NEXT_PUBLIC_STRAVA_MOBILE_REDIRECT_URI || ''
          : process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI || ''
      );
      
      const scope = 'read,activity:read_all,profile:read_all';
      const authUrl = `https://www.strava.com/oauth/${isMobile ? 'mobile/' : ''}authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&approval_prompt=force`;

      if (isMobile) {
        // For mobile, redirect in the same window
        window.location.href = authUrl;
      } else {
        // For desktop, open in a popup
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const popup = window.open(
          authUrl,
          'Strava Authorization',
          `width=${width},height=${height},left=${left},top=${top}`
        );

        if (!popup) {
          throw new Error('Please allow popups to connect with Strava');
        }

        // Check if popup is closed
        const checkPopup = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkPopup);
            setIsLoading(false);
            // If popup was closed without completing auth, redirect to login
            if (!document.cookie.includes('strava_access_token')) {
              setError('Authentication was cancelled');
              setTimeout(() => {
                router.push('/auth/signin');
              }, 3000);
            }
          }
        }, 1000);
      }
    } catch (err) {
      console.error('Error during Strava auth:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect with Strava');
      setIsLoading(false);
      // Redirect to login page after a short delay to show the error
      setTimeout(() => {
        router.push('/auth/signin');
      }, 3000);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
            <p className="text-sm mt-2">Redirecting to login page...</p>
          </AlertDescription>
        </Alert>
      )}
      
      <Button
        onClick={handleStravaAuth}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-[#FC4C02] hover:bg-[#FC4C02]/90 text-white"
      >
        {isLoading ? (
          <>
            <LoadingSpinner className="w-5 h-5" />
            Connecting...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066l-2.084 4.116zM24 18.966c0 1.118-.933 2.034-2.044 2.034h-3.065v-2.034h3.065v-2.034h-3.066v-2.034h3.066v-2.034h-3.066v-2.034h3.066c1.111 0 2.044.916 2.044 2.034v10.172zM8.04 16.93V7.05h3.065v9.88H8.04zm-5.15-7.88h3.066v9.88H2.89V9.05z" />
            </svg>
            Connect with Strava
          </>
        )}
      </Button>
    </div>
  );
} 