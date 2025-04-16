"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface RaceAvatarProps {
  progress: number;
  position: { x: number; y: number };
  isActivelyRunning: boolean;
}

export function RaceAvatar({ progress, position, isActivelyRunning }: RaceAvatarProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Only pulse when actively running
    if (!isActivelyRunning) {
      setIsVisible(true);
      return;
    }

    const interval = setInterval(() => {
      setIsVisible(prev => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActivelyRunning]);

  return (
    <motion.div
      className="absolute"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)'
      }}
      animate={{
        scale: isActivelyRunning && isVisible ? 1.2 : 1,
        opacity: isActivelyRunning ? (isVisible ? 1 : 0.8) : 0.6
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut"
      }}
    >
      <div 
        className={`w-6 h-6 rounded-full border-2 border-white shadow-lg ${
          isActivelyRunning ? 'bg-blue-500' : 'bg-gray-400'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="w-4 h-4 mx-auto mt-0.5"
        >
          <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM20 12.5V23h-2v-9.5h-3.5V21h-2v-7.5h-3.5V23h-2V12.5c0-1.1.9-2 2-2h9c1.1 0 2 .9 2 2z"/>
        </svg>
      </div>
    </motion.div>
  );
} 