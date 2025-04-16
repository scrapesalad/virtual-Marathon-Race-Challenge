'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { downloadFile } from '@/lib/utils';
import { toast } from 'react-hot-toast';

const TRAINING_PLANS = [
  {
    title: '16-Week Beginner Marathon Plan',
    description: 'Perfect for first-time marathoners, this plan gradually builds your endurance over 16 weeks.',
    url: 'https://storage.googleapis.com/wzukusers/user-26183507/documents/de626c6408aa465189994b8073d7b048/16%20Week%20Beginner%20Marathon%20Plan.pdf',
    filename: '16-Week-Beginner-Marathon-Plan.pdf'
  },
  {
    title: '12-Week Intermediate Marathon Plan',
    description: 'For runners with some marathon experience looking to improve their time.',
    url: 'https://storage.googleapis.com/wzukusers/user-26183507/documents/de626c6408aa465189994b8073d7b048/12%20Week%20Intermediate%20Marathon%20Plan.pdf',
    filename: '12-Week-Intermediate-Marathon-Plan.pdf'
  },
  {
    title: '8-Week Advanced Marathon Plan',
    description: 'For experienced runners aiming for a personal best.',
    url: 'https://storage.googleapis.com/wzukusers/user-26183507/documents/de626c6408aa465189994b8073d7b048/8%20Week%20Advanced%20Marathon%20Plan.pdf',
    filename: '8-Week-Advanced-Marathon-Plan.pdf'
  }
];

export default function MarathonPage() {
  const [downloadingPlan, setDownloadingPlan] = useState<string | null>(null);

  const handleDownloadPlan = async (url: string, filename: string, title: string) => {
    try {
      setDownloadingPlan(title);
      await downloadFile(url, filename);
      toast.success(`${title} downloaded successfully!`);
    } catch (error) {
      console.error('Error downloading training plan:', error);
      toast.error(`Failed to download ${title}`);
    } finally {
      setDownloadingPlan(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Marathon Training Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TRAINING_PLANS.map((plan) => (
          <div key={plan.title} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">{plan.title}</h2>
            <p className="mb-4 text-gray-600">{plan.description}</p>
            <Button
              onClick={() => handleDownloadPlan(plan.url, plan.filename, plan.title)}
              disabled={downloadingPlan === plan.title}
              className="w-full"
            >
              {downloadingPlan === plan.title ? 'Downloading...' : 'Download Plan'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 