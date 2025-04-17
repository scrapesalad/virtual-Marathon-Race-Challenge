import { CalorieCalculator } from '@/components/CalorieCalculator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calorie Expenditure Calculator | Virtual Race',
  description: 'Calculate calories burned during various activities using MET values. Estimate energy expenditure for running, cycling, swimming, and more.',
};

export default function CalorieCalculatorPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Calorie Expenditure Calculator</h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Estimate the calories burned during your workouts based on your weight, activity type, and duration. 
        Our calculator uses Metabolic Equivalent of Task (MET) values to provide accurate estimates for various activities, 
        from walking to high-intensity running and cycling.
      </p>
      <CalorieCalculator />
    </div>
  );
} 