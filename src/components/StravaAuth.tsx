import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStravaAuthUrl } from '@/lib/strava';

export default function StravaAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Handle the message from the popup window
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'STRAVA_AUTH_COMPLETE') {
        router.push('/dashboard');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router]);

  const handleStravaAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const authUrl = getStravaAuthUrl();
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isMobile) {
        // For mobile, open in the same window
        window.location.href = authUrl;
      } else {
        // For desktop, open in a popup
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const popup = window.open(
          authUrl,
          'Strava Auth',
          `width=${width},height=${height},left=${left},top=${top}`
        );

        if (!popup) {
          setError('Please allow popups to connect with Strava');
          return;
        }

        // Check if popup is closed
        const checkPopup = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkPopup);
            setIsLoading(false);
          }
        }, 1000);
      }
    } catch (err) {
      console.error('Error during Strava auth:', err);
      setError('Failed to connect with Strava. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleStravaAuth}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </>
        ) : (
          <>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066l-2.084 4.116zM24 18.966c0 1.118-.933 2.034-2.044 2.034h-3.065v-2.034h3.065v-2.034h-3.066v-2.034h3.066v-2.034h-3.066v-2.034h3.066c1.111 0 2.044.916 2.044 2.034v10.172zM8.04 16.93V7.05h3.065v9.88H8.04zm-5.15-7.88h3.066v9.88H2.89V9.05z" />
            </svg>
            Connect with Strava
          </>
        )}
      </button>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
} 