'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoginForm } from './LoginForm';

export function LoginClient() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl');

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm error={error} callbackUrl={callbackUrl} />
    </Suspense>
  );
} 