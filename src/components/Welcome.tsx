'use client';

import { Button } from './ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export function Welcome() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
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
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/sign-up">
                  <Button variant="primary" size="lg" fullWidth>
                    Sign Up
                  </Button>
                </Link>
                <Link href="/races">
                  <Button variant="secondary" size="lg" fullWidth>
                    View Races
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