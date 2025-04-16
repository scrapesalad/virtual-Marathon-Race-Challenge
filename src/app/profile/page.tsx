import { Metadata, Viewport } from 'next';
import Profile from '@/components/profile/Profile';

export const metadata: Metadata = {
  title: 'Profile | Virtual Race',
  description: 'View and edit your profile information',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Profile />
      </div>
    </main>
  );
} 