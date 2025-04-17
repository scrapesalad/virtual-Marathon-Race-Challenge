'use client';

import { ReactNode, useEffect, useState } from 'react';
import { MobileLayout } from '../mobile/MobileLayout';
import { usePathname } from 'next/navigation';
import { Toaster } from '@/components/ui/Toaster';
import { ToastProvider as ToastPrimitiveProvider } from '@/components/ui/Toast';
import { ToastProvider } from '@/components/ui/use-toast';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't show mobile layout on auth pages
  const isAuthPage = pathname.startsWith('/auth') || 
                    pathname === '/login' || 
                    pathname === '/sign-up';

  const content = (
    <>
      {isMobile && !isAuthPage ? (
        <MobileLayout>{children}</MobileLayout>
      ) : (
        <div className="min-h-screen">{children}</div>
      )}
      <Toaster />
    </>
  );

  return (
    <ToastProvider>
      <ToastPrimitiveProvider>
        {content}
      </ToastPrimitiveProvider>
    </ToastProvider>
  );
} 