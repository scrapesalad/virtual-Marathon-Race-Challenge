import { HeartRateCalculator } from '@/components/HeartRateCalculator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Heart Rate Zone Calculator | Virtual Race',
  description: 'Calculate your heart rate training zones using the Karvonen formula. Optimize your training intensity for better results.',
};

export default function HeartRateCalculatorPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Heart Rate Zone Calculator</h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Use this calculator to determine your heart rate training zones based on your age and resting heart rate. 
        Training in the right heart rate zones helps optimize your workouts and achieve your fitness goals more effectively.
      </p>
      <HeartRateCalculator />
    </div>
  );
} 