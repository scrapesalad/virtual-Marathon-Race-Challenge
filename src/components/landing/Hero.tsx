'use client';

import { Button } from '../ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-20 sm:py-32">
      <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                Experience the World's
                <span className="block text-orange-500">Greatest Marathons</span>
                <span className="block">Virtually</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg">
                Train on iconic routes, track your progress in real-time, and compete with runners worldwide. Your next marathon starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/auth/signin">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    Start Running
                  </Button>
                </Link>
                <Link href="/races">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Explore Races
                  </Button>
                </Link>
              </div>
              <div className="pt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  🏃‍♂️ Join 50,000+ runners already training on virtual routes
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/marathon-hero.jpg"
                  alt="Runner crossing finish line"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-lg font-semibold">New York City Marathon</p>
                    <p className="text-sm">26.2 miles of iconic city views</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 