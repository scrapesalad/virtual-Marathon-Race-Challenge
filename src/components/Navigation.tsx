'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold">
            Virtual Race
          </Link>
          
          <div className="hidden md:flex space-x-4">
            <Link href="/races">
              <Button 
                variant={isActive('/races') ? 'default' : 'ghost'}
                className="text-sm"
              >
                Races
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button 
                variant={isActive('/dashboard') ? 'default' : 'ghost'}
                className="text-sm"
              >
                Dashboard
              </Button>
            </Link>
            <Link href="/profile">
              <Button 
                variant={isActive('/profile') ? 'default' : 'ghost'}
                className="text-sm"
              >
                Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 