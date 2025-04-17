import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientLayout } from '@/components/layout/ClientLayout';
import { Navigation } from '@/components/Navigation';

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Virtual Race",
  description: "Join virtual marathons and compete with runners worldwide",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Navigation />
        <main className="pt-16">
          <ClientLayout>{children}</ClientLayout>
        </main>
      </body>
    </html>
  );
} 