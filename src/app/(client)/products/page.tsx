'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types';
import { Clock, Search, Filter, ArrowLeft } from 'lucide-react';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, isInCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

  const categories = [
    'All',
    'Lights, Diyas & Candles',
    'Diwali Gifts',
    'Appliances & Gadgets',
    'Home & Living',
    'Vegetables & Fruits',
    'Atta, Dal & Rice',
    'Oil, Ghee & Masala',
    'Dairy, Bread & Milk',
  ];

  const products: Product[] = [
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
    {
      id: '4',
      name: 'Decorative Items Set',
      description: 'Beautiful decorations',
      price: 199,
      image: 'image 33.png',
      category: 'Home & Living',
      stock: 25,
      deliveryTime: '20',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '5',
      name: 'Fresh Vegetables Pack',
      description: 'Farm fresh vegetables',
      price: 129,
      image: 'image 41.png',
      category: 'Vegetables & Fruits',
      stock: 100,
      deliveryTime: '16',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '6',
      name: 'Premium Basmati Rice',
      description: 'Long grain rice',
      price: 299,
      image: 'image 42.png',
      category: 'Atta, Dal & Rice',
      stock: 60,
      deliveryTime: '16',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          <h1 className="text-4xl font-bold text-white mb-2">All Products</h1>
          <p className="text-white/90 text-lg">Discover amazing products delivered in minutes</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-12 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 appearance-none bg-white cursor-pointer min-w-[200px]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h3>
            <p className="text-gray-600">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all hover:scale-105"
              >
                <div className="relative w-full h-56 bg-gray-50">
                  <Image
                    src={`/images/${product.image}`}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 h-12">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-1">{product.description}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-400">{product.deliveryTime} MINS</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#FFA500] text-2xl font-bold">₹{product.price}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                        isInCart(product.id)
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                          : 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white hover:shadow-lg hover:scale-105'
                      }`}
                    >
                      {isInCart(product.id) ? 'Added ✓' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}