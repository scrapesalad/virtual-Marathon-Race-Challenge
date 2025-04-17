import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Available Races | Virtual Race',
  description: 'Choose from our collection of virtual marathons from around the world',
};

export default function RacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 