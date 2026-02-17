'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { Clock, Search, Filter, ArrowLeft, ShoppingCart } from 'lucide-react';
import { getAllProducts, getAllCategories, getProductImageUrl } from '@/lib/products.api';
import { getAllCategories as fetchCategories } from '@/lib/categories.api';

interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  deliveryTime: string;
  isActive: boolean;
}

interface Category {
  _id: string;
  name: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, isInCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchQuery, selectedCategory]);

  const loadCategories = async () => {
    try {
      const response = await fetchCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await getAllProducts(
        currentPage,
        12,
        searchQuery,
        selectedCategory || undefined
      );

      setProducts(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalProducts(response.pagination.total);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._id || product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock,
      deliveryTime: product.deliveryTime,
      isActive: product.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

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
          <p className="text-white/90 text-lg">
            {totalProducts} products available
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="pl-12 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 appearance-none bg-white cursor-pointer min-w-[200px]"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h3>
            <p className="text-gray-600">Try adjusting your search or filter</p>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id || product.id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all hover:scale-105"
                >
                  {/* Product Image */}
                  <div
                    className="relative w-full h-56 bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/products/${product._id || product.id}`)}
                  >
                    <img
                      src={getProductImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-contain p-4"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/400x400/FFD700/white?text=No+Image';
                      }}
                    />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <h3
                      className="font-bold text-gray-800 mb-1 line-clamp-2 h-12 cursor-pointer hover:text-[#FFA500]"
                      onClick={() => router.push(`/products/${product._id || product.id}`)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-1">{product.description}</p>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mb-2 inline-block">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1 mb-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-400">{product.deliveryTime} MINS</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#FFA500] text-2xl font-bold">₹{product.price}</span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                          product.stock === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : isInCart(product._id || product.id)
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                            : 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white hover:shadow-lg hover:scale-105'
                        }`}
                      >
                        {product.stock === 0
                          ? 'Out of Stock'
                          : isInCart(product._id || product.id)
                          ? 'Added ✓'
                          : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    currentPage === 1
                      ? 'bg-white/50 text-white/50 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      currentPage === i + 1
                        ? 'bg-white text-[#FFA500] shadow-lg'
                        : 'bg-white/50 text-white hover:bg-white/80'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    currentPage === totalPages
                      ? 'bg-white/50 text-white/50 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}