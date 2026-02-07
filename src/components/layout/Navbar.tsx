'use client';

import { ShoppingCart, User, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';

export default function Navbar() {
  const router = useRouter();
  const { itemCount } = useCart();

  return (
    <nav className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            onClick={() => router.push('/dashboard')}
            className="text-white text-2xl font-bold cursor-pointer"
          >
            QuickCart
          </div>

          <div className="flex items-center gap-4">
            <button className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
              <Search className="w-6 h-6" />
            </button>

            <button
              onClick={() => router.push('/cart')}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors relative"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => router.push('/profile')}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}