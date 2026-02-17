'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trash2, Eye, Search, Plus, Edit, Package } from 'lucide-react';
import { getAllProducts, deleteProduct, Product } from '@/lib/products.api';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const productsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchQuery]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await getAllProducts(currentPage, productsPerPage, searchQuery);
      
      setProducts(response.data);
      setTotalProducts(response.pagination.total);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete._id || productToDelete.id);
      
      await fetchProducts();
      
      setShowDeleteModal(false);
      setProductToDelete(null);
      
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA500]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Product Management</h1>
        <p className="text-gray-600">Manage all products in your store</p>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, description, or category..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50"
            />
          </div>

          {/* Add Product Button */}
          <button
            onClick={() => router.push('/admin/products/create')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Total Products</p>
            <p className="text-2xl font-bold text-gray-800">{totalProducts}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Active Products</p>
            <p className="text-2xl font-bold text-gray-800">{products.filter(p => p.isActive).length}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
            <p className="text-2xl font-bold text-gray-800">{products.filter(p => p.stock === 0).length}</p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          products.map((product) => (
            <div key={product._id || product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={product.image.startsWith('/') ? product.image : `/images/${product.image}`}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder.png';
                  }}
                />
                {!product.isActive && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Inactive
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#FFA500] text-xl font-bold">₹{product.price}</span>
                  <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  <span className="bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/admin/products/edit/${product._id || product.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(product)}
                    className="flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * productsPerPage) + 1} to {Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} products
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    currentPage === index + 1
                      ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Delete Product?</h3>
              <p className="text-gray-600">
                Are you sure you want to delete <strong>{productToDelete.name}</strong>? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}