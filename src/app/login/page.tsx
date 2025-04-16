import { Metadata, Viewport } from 'next';
import Login from '@/components/auth/Login';

export const metadata: Metadata = {
  title: 'Login - Virtual Race',
  description: 'Sign in to your account',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function LoginPage() {
  return <Login />;
} 