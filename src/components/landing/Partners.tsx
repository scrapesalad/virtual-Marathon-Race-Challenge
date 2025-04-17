'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const partners = [
  {
    name: 'Strava',
    logo: '/images/partners/strava.svg',
    width: 140,
    height: 40,
  },
  {
    name: 'Garmin',
    logo: '/images/partners/garmin.svg',
    width: 140,
    height: 40,
  },
  {
    name: 'Nike',
    logo: '/images/partners/nike.svg',
    width: 80,
    height: 40,
  },
  {
    name: 'Adidas',
    logo: '/images/partners/adidas.svg',
    width: 140,
    height: 40,
  },
];

export function Partners() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Trusted by the world's leading fitness brands
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Seamlessly connect your favorite fitness apps and devices
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 items-center justify-items-center">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300"
              >
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={partner.width}
                  height={partner.height}
                  className="dark:invert"
                />
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            More integrations coming soon
          </p>
        </div>
      </div>
    </section>
  );
} 