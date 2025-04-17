'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';

export function VerifyEmailClient() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const verifyEmail = async () => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Email verified successfully! You can now log in.');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to verify email');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred while verifying your email');
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setMessage('Email address not found. Please try registering again.');
      return;
    }

    setIsResending(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Verification email sent! Please check your inbox.');
      } else {
        setMessage(data.error || 'Failed to resend verification email');
      }
    } catch (error) {
      setMessage('An error occurred while resending the verification email');
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    verifyEmail();
  }, [token]);

  const getAlertVariant = () => {
    switch (status) {
      case 'loading':
        return 'default';
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="container max-w-md mx-auto mt-8 px-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            {status === 'loading' && (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            )}
            <Alert variant={getAlertVariant()}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
            {status === 'error' && email && (
              <Button
                variant="outline"
                onClick={handleResendVerification}
                disabled={isResending}
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend Verification Email'
                )}
              </Button>
            )}
            {status === 'success' && (
              <p className="text-sm text-gray-500 text-center">
                Redirecting to login page...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 