import { SignUp } from '@/components/auth/SignUp';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - Virtual Race',
  description: 'Create your account to join virtual races',
};

export default function SignUpPage() {
  return <SignUp />;
} 