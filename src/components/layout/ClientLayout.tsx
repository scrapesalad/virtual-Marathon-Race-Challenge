'use client';

import { AppLayout } from '@/components/layout/AppLayout';

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
} 