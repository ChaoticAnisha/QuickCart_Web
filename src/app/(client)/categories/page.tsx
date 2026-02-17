'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { getAllCategories, Category } from '@/lib/categories.api';

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryImage = (image: string) => {
    if (!image) return '/images/placeholder.png';
    if (image.startsWith('http')) return image;
    if (image.startsWith('/uploads')) return `http://localhost:5000${image}`;
    if (image.startsWith('/images')) return image;
    return `/images/${image}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFD700] to-[#FFA500] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

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
        {categories.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Categories Yet</h3>
            <p className="text-gray-600">Categories will appear here once added by admin</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <button
                key={category._id || category.id}
                onClick={() => router.push(`/products?category=${encodeURIComponent(category.name)}`)}
                className="bg-white rounded-2xl p-6 flex flex-col items-center gap-4 hover:shadow-2xl transition-all hover:scale-105 shadow-xl"
              >
                <div className="relative w-32 h-32">
                  <img
                    src={getCategoryImage(category.image)}
                    alt={category.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/400x400/FFD700/white?text=No+Image';
                    }}
                  />
                </div>
                <span className="font-bold text-gray-800 text-center text-lg">{category.name}</span>
                {category.productsCount !== undefined && (
                  <span className="text-sm text-gray-500">{category.productsCount} products</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}