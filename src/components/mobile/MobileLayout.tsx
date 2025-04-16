import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Map, Trophy, User } from 'lucide-react';

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-16">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
        <div className="flex justify-around items-center">
          <Link 
            href="/dashboard" 
            className={`flex flex-col items-center p-2 ${isActive('/dashboard') ? 'text-primary' : 'text-gray-500'}`}
          >
            <Home size={24} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link 
            href="/races" 
            className={`flex flex-col items-center p-2 ${isActive('/races') ? 'text-primary' : 'text-gray-500'}`}
          >
            <Trophy size={24} />
            <span className="text-xs mt-1">Races</span>
          </Link>
          
          <Link 
            href="/map" 
            className={`flex flex-col items-center p-2 ${isActive('/map') ? 'text-primary' : 'text-gray-500'}`}
          >
            <Map size={24} />
            <span className="text-xs mt-1">Map</span>
          </Link>
          
          <Link 
            href="/profile" 
            className={`flex flex-col items-center p-2 ${isActive('/profile') ? 'text-primary' : 'text-gray-500'}`}
          >
            <User size={24} />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
} 