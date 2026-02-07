'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, ShoppingCart, User, Grid } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Grid, label: 'Category', path: '/products' },
  { icon: ShoppingCart, label: 'Cart', path: '/cart' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export default function ClientBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center justify-center flex-1"
            >
              <Icon
                className={`w-6 h-6 ${
                  isActive ? 'text-[#FFA500]' : 'text-gray-400'
                }`}
                fill={isActive ? 'currentColor' : 'none'}
              />
              <span
                className={`text-xs mt-1 ${
                  isActive ? 'text-[#FFA500] font-semibold' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}