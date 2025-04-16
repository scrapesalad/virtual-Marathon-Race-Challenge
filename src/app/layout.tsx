import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppLayout } from '@/components/layout/AppLayout';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Virtual Race",
  description: "Run virtual races with friends",
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AppLayout>
          {children}
        </AppLayout>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
