import type { Metadata, Viewport } from "next";

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

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 