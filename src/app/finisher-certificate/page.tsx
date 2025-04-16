'use client';

import { FinisherCertificate } from '@/components/FinisherCertificate';

export default function FinisherCertificatePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Your Finisher Certificate
        </h1>
        
        <FinisherCertificate 
          name="John Doe"
          raceName="NYC Marathon Virtual Challenge"
          finishTime="3:42:15"
          finishDate="April 8, 2023"
          bibNumber="12345"
        />
      </div>
    </div>
  );
} 