import { Metadata } from 'next';
import { PaceCalculator } from '@/components/PaceCalculator';

export const metadata: Metadata = {
  title: 'VDOT Running Calculator - Virtual Race',
  description: 'Calculate your training paces using Jack Daniels\' VDOT formula',
};

export default function PaceCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            VDOT Running Calculator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Calculate your optimal training paces based on your recent race performance
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <PaceCalculator />
        </div>
        
        <div className="prose dark:prose-invert max-w-none">
          <h2>About the VDOT Calculator</h2>
          <p>
            The VDOT Running Calculator is based on Jack Daniels' running formula, which helps runners 
            determine their optimal training paces based on their current fitness level. By entering a 
            recent race time, you can get personalized training paces for different types of workouts:
          </p>
          
          <ul>
            <li><strong>Easy Pace:</strong> For recovery runs and long runs</li>
            <li><strong>Marathon Pace:</strong> Your target pace for marathon-specific training</li>
            <li><strong>Threshold Pace:</strong> For tempo runs and lactate threshold workouts</li>
            <li><strong>Interval Pace:</strong> For VO2max intervals (typically 3-5 minutes)</li>
            <li><strong>Repetition Pace:</strong> For speed work and short repeats</li>
          </ul>
          
          <h2>How to Use</h2>
          <ol>
            <li>Select your race distance (5K, 10K, Half Marathon, or Marathon)</li>
            <li>Enter your finish time for that race</li>
            <li>Click "Calculate Paces" to see your recommended training paces</li>
          </ol>
          
          <p>
            Remember that these paces are guidelines and should be adjusted based on factors like 
            weather, terrain, fatigue, and your current training phase.
          </p>
        </div>
      </div>
    </div>
  );
} 