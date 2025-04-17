'use client';

import { Button } from './ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getStravaAuthUrl } from '@/lib/strava';

export function Welcome() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [stravaUrl, setStravaUrl] = useState('');
  const [stravaEnabled, setStravaEnabled] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI;
    
    if (clientId && redirectUri) {
      try {
        const url = getStravaAuthUrl();
        setStravaUrl(url);
        setStravaEnabled(true);
      } catch (error) {
        console.error('Failed to get Strava auth URL:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className={`space-y-6 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
                Start Your <span className="text-orange-500">Journey</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Run iconic routes virtually, track your progress, and compete with runners worldwide.
              </p>
              <div className="flex flex-col gap-4 pt-4">
                <Link href="/sign-up" className="w-full">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-6"
                  >
                    Create Free Account
                  </Button>
                </Link>
                {stravaEnabled && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-gray-500">
                          Or connect with
                        </span>
                      </div>
                    </div>
                    <a 
                      href={stravaUrl} 
                      className="w-full"
                    >
                      <Button 
                        variant="secondary" 
                        size="lg" 
                        className="w-full bg-[#FC4C02] hover:bg-[#E34402] text-white border-none flex items-center justify-center gap-2"
                      >
                        <Image
                          src="/images/partners/strava-logo-white.svg"
                          alt="Strava logo"
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                        Connect with Strava
                      </Button>
                    </a>
                  </>
                )}
                <Link href="/races" className="w-full">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full"
                  >
                    Browse Races
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className={`relative ${isLoaded ? 'animate-slide-in' : 'opacity-0 translate-x-10'}`}>
              <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
                <Image
                  src="/images/marathon-group.jpg"
                  alt="Group of runners in a marathon"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectPosition: 'center 20%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              50K+ runners on iconic routes
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join our community of runners from around the world
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {/* Partner logos */}
            <div className="w-24 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">Nike</span>
            </div>
            <div className="w-24 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">Strava</span>
            </div>
            <div className="w-24 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">Adidas</span>
            </div>
            <div className="w-24 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">Garmin</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 