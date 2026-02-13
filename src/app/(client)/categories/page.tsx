'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export default function CategoriesPage() {
  const router = useRouter();

  const categories = [
    { img: 'image 50.png', text: 'Lights, Diyas & Candles' },
    { img: 'image 51.png', text: 'Diwali Gifts' },
    { img: 'image 52.png', text: 'Appliances & Gadgets' },
    { img: 'image 39.png', text: 'Home & Living' },
    { img: 'image 41.png', text: 'Vegetables & Fruits' },
    { img: 'image 42.png', text: 'Atta, Dal & Rice' },
    { img: 'image 43.png', text: 'Oil, Ghee & Masala' },
    { img: 'image 44 (1).png', text: 'Dairy, Bread & Milk' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFD700] to-[#FFA500] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-white hover:text-white/80 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Dashboard</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">All Categories</h1>
          <p className="text-white/90 text-lg">Browse products by category</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((item, index) => (
            <button
              key={index}
              onClick={() => router.push(`/products?category=${encodeURIComponent(item.text)}`)}
              className="bg-white rounded-2xl p-6 flex flex-col items-center gap-4 hover:shadow-2xl transition-all hover:scale-105 shadow-xl"
            >
              <div className="relative w-32 h-32">
                <Image 
                  src={`/images/${item.img}`} 
                  alt={item.text} 
                  fill 
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <span className="font-bold text-gray-800 text-center text-lg">{item.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}