'use client';

import { useRouter } from 'next/navigation';
import { RaceCelebration } from '@/components/RaceCelebration';

export default function CelebrationPage() {
  const router = useRouter();

  const handleViewCertificate = () => {
    router.push('/finisher-certificate');
  };

  const handleShareResult = () => {
    // In a real app, this would open a share dialog
    alert('Sharing result...');
  };

  return (
    <RaceCelebration
      raceName="Virtual Marathon 2024"
      finishTime="3:45:22"
      position={42}
      totalParticipants={1000}
      onViewCertificate={handleViewCertificate}
      onShareResult={handleShareResult}
    />
  );
} 