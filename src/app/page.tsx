'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFD700] to-[#FFA500] flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="relative w-40 h-40 mx-auto mb-6">
            <Image src="/images/image 1 (1).png" alt="QuickCart Logo" fill className="object-contain" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">QuickCart</h1>
          <p className="text-xl md:text-2xl text-white/90 mb-2">Lightning Fast Delivery 🚀</p>
          <p className="text-lg text-white/80">Get your groceries in just 16 minutes</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => router.push('/login')}
            className="px-8 py-4 bg-white text-[#FFA500] rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push('/register')}
            className="px-8 py-4 bg-white/20 text-white border-2 border-white rounded-xl font-bold text-lg hover:bg-white/30 transition-all duration-200 hover:scale-105"
          >
            Create Account
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <div className="text-4xl mb-2">⚡</div>
            <h3 className="font-bold text-lg mb-2">Super Fast</h3>
            <p className="text-sm text-white/80">Delivery in 16 minutes</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <div className="text-4xl mb-2">🛒</div>
            <h3 className="font-bold text-lg mb-2">Wide Selection</h3>
            <p className="text-sm text-white/80">1000+ products available</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <div className="text-4xl mb-2">💰</div>
            <h3 className="font-bold text-lg mb-2">Best Prices</h3>
            <p className="text-sm text-white/80">Competitive pricing daily</p>
          </div>
        </div>
      </div>
    </div>
  );
}