'use client';

import { ToastContainer } from './use-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ToastContainer>{children}</ToastContainer>;
} 