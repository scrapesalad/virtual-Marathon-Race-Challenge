import { Metadata } from 'next';
import { Viewport } from 'next';
import { VerifyEmailClient } from '@/components/auth/VerifyEmailClient';

export const metadata: Metadata = {
  title: 'Verify Email - Virtual Race',
  description: 'Verify your email address',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please wait while we verify your email address
          </p>
        </div>
        <VerifyEmailClient />
      </div>
    </div>
  );
} 