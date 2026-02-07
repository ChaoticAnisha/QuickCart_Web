'use client';

import { useState, useEffect } from 'react';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilter from '@/components/product/ProductFilter';
import Pagination from '@/components/common/Pagination';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useCart } from '@/hooks/useCart';
import { usePagination } from '@/hooks/usePagination';
import { Product } from '@/types';
import { CATEGORIES } from '@/lib/constants';

export default function ProductsPage() {
  const { addToCart, cart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setIsLoading(true);
    
    // TODO: Replace with actual API call
    setTimeout(() => {
      const mockProducts: Product[] = [
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
          description: 'Complete set',
          price: 199,
          image: 'image 33.png',
          category: 'Home & Living',
          stock: 20,
          deliveryTime: '20',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      
      setProducts(mockProducts);
      setIsLoading(false);
    }, 1000);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pagination = usePagination({
    totalItems: filteredProducts.length,
    itemsPerPage: 12,
  });

  const paginatedProducts = filteredProducts.slice(
    pagination.startIndex,
    pagination.endIndex
  );

  const cartProductIds = cart.map((item) => item.productId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] p-6 mb-6">
        <h1 className="text-3xl font-bold text-white text-center">Products</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <ProductFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={CATEGORIES.map((c) => c.name)}
        />

        <ProductGrid
          products={paginatedProducts}
          onAddToCart={addToCart}
          cartProductIds={cartProductIds}
        />

        {filteredProducts.length > 12 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.goToPage}
          />
        )}
      </div>
    </div>
  );
}