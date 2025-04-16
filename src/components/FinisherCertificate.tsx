'use client';

import { useState } from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';

interface FinisherCertificateProps {
  name: string;
  raceName: string;
  finishTime: string;
  finishDate: string;
  bibNumber: string;
}

export function FinisherCertificate({ 
  name, 
  raceName, 
  finishTime, 
  finishDate, 
  bibNumber 
}: FinisherCertificateProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = () => {
    setIsSharing(true);
    // In a real app, this would handle sharing the certificate
    setTimeout(() => {
      setIsSharing(false);
    }, 2000);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="p-0">
        <div className="relative">
          {/* Certificate Background */}
          <div className="bg-gradient-to-b from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-900 p-8 md:p-12 border-8 border-orange-500">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <div className="text-9xl font-bold text-orange-500 transform -rotate-45">
                VR
              </div>
            </div>
            
            {/* Certificate Content */}
            <div className="relative z-10 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Finisher Certificate
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                {raceName}
              </p>
              
              <div className="mb-8">
                <p className="text-gray-600 dark:text-gray-300 mb-1">This is to certify that</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {name}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  has successfully completed the virtual race
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Finish Time</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">{finishTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Finish Date</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">{finishDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Bib Number</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">#{bibNumber}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <Button 
                  variant="primary" 
                  onClick={handleShare}
                  disabled={isSharing}
                >
                  {isSharing ? 'Sharing...' : 'Share Certificate'}
                </Button>
                <Button variant="outline">
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 