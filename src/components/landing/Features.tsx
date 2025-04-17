'use client';

import { motion } from 'framer-motion';
import { MapIcon, TrophyIcon, UsersIcon, ActivitySquareIcon } from 'lucide-react';

const features = [
  {
    name: 'Interactive Route Maps',
    description: 'Experience real marathon routes with detailed elevation profiles and interactive 3D maps.',
    icon: MapIcon,
  },
  {
    name: 'Live Progress Tracking',
    description: 'Track your progress in real-time and see how you stack up against other runners worldwide.',
    icon: ActivitySquareIcon,
  },
  {
    name: 'Global Community',
    description: 'Connect with runners from around the world, share experiences, and motivate each other.',
    icon: UsersIcon,
  },
  {
    name: 'Virtual Achievements',
    description: 'Earn medals, certificates, and badges as you complete virtual races and hit milestones.',
    icon: TrophyIcon,
  },
];

export function Features() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Everything you need to run virtually
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Train smarter, not harder with our comprehensive virtual racing platform.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl opacity-10 transform -rotate-3"></div>
                <div className="relative p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                  <div className="h-16 w-16 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.name}
                  </h3>
                  <p className="mt-4 text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 