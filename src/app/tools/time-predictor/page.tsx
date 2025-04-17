import { TimePredictor } from '@/components/TimePredictor';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Race Time Predictor | Virtual Race',
  description: 'Predict your race times for different distances using proven formulas for both running and cycling.',
};

export default function TimeCalculatorPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Race Time Predictor</h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Use this tool to predict your finish time for different race distances based on your previous performances. 
        We use proven formulas like Riegel and Cameron to provide accurate predictions for both running and cycling events.
      </p>
      <TimePredictor />
    </div>
  );
} 