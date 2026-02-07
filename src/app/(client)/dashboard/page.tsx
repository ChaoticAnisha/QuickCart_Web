'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/types';

export default function ClientDashboardPage() {
  const router = useRouter();
  const { addToCart, isInCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const diwaliSaleData = [
    { img: 'image 50.png', text: 'Lights, Diyas\n& Candles' },
    { img: 'image 51.png', text: 'Diwali\nGifts' },
    { img: 'image 52.png', text: 'Appliances\n& Gadgets' },
    { img: 'image 53.png', text: 'Home\n& Living' },
  ];

  const categoryData: Product[] = [
    {
      id: '1',
      name: 'Golden Glass Wooden Lid Candle',
      description: 'Premium scented candle',
      price: 79,
      image: 'image 54.png',
      category: 'Lights, Diyas & Candles',
      stock: 50,
      deliveryTime: '16',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Royal Gulab Jamun By Bikano',
      description: 'Authentic sweets',
      price: 149,
      image: 'image 57.png',
      category: 'Diwali Gifts',
      stock: 30,
      deliveryTime: '16',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      name: 'Premium Scented Candle',
      description: 'Luxury candle',
      price: 79,
      image: 'image 63.png',
      category: 'Lights, Diyas & Candles',
      stock: 45,
      deliveryTime: '16',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const groceryKitchenData = [
    { img: 'image 41.png', text: 'Vegetables &\nFruits' },
    { img: 'image 42.png', text: 'Atta, Dal &\nRice' },
    { img: 'image 43.png', text: 'Oil, Ghee &\nMasala' },
    { img: 'image 44 (1).png', text: 'Dairy, Bread &\nMilk' },
    { img: 'image 45 (1).png', text: 'Biscuits &\nBakery' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="w-full bg-gradient-to-b from-[#FFD700] to-[#FFA500]">
        <div className="max-w-7xl mx-auto pt-6 pb-5 px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex justify-between items-start mb-5">
            <div className="flex-1">
              <p className="text-white text-sm font-normal mb-1">QuickCart in</p>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-white text-2xl font-bold">16 minutes</h2>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <p className="text-white text-xs font-light truncate">HOME - Your Location</p>
              </div>
            </div>
            <button onClick={() => router.push('/profile')} className="ml-3 p-1 bg-white rounded-full shadow-lg">
              <div className="w-11 h-11 bg-[#FFA500] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="flex items-center px-4 py-3">
              <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search 'ice-cream'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-gray-700 text-sm"
              />
              <svg className="w-5 h-5 text-gray-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Mega Diwali Sale */}
        <div className="max-w-7xl mx-auto pb-5 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🎉</span>
            <h3 className="text-white text-xl font-bold">Mega Diwali Sale</h3>
            <span className="text-2xl">🎉</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {diwaliSaleData.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => router.push('/products')}
              >
                <div className="relative w-14 h-14 mb-2">
                  <Image src={`/images/${item.img}`} alt={item.text} fill className="object-contain" />
                </div>
                <p className="text-center text-[9px] font-semibold text-gray-800 leading-tight whitespace-pre-line">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button onClick={() => router.push('/products')} className="text-white font-bold text-sm">
              See All →
            </button>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-gray-800 text-lg font-bold">Featured Products</h3>
          <button onClick={() => router.push('/products')} className="text-[#FFA500] font-semibold text-sm">
            See All
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categoryData.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} isInCart={isInCart(product.id)} />
          ))}
        </div>
      </div>

      {/* Grocery & Kitchen */}
      <div className="max-w-7xl mx-auto py-5 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-gray-800 text-lg font-bold">Grocery & Kitchen</h3>
          <button onClick={() => router.push('/products')} className="text-[#FFA500] font-semibold text-sm">
            See All
          </button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {groceryKitchenData.map((item, index) => (
            <div key={index} className="cursor-pointer" onClick={() => router.push('/products')}>
              <div className="w-full aspect-square bg-[#FFF8DC] rounded-xl shadow-md flex items-center justify-center p-2 mb-2 hover:shadow-lg transition-shadow">
                <div className="relative w-full h-full">
                  <Image src={`/images/${item.img}`} alt={item.text} fill className="object-contain" />
                </div>
              </div>
              <p className="text-center text-[10px] font-medium text-gray-800 leading-tight whitespace-pre-line">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}