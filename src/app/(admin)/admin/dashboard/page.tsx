'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Users, Package, Grid3x3, ShoppingBag } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { getProductImageUrl } from '@/lib/products.api';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  activeProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

interface RecentProduct {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  isActive: boolean;
  createdAt: string;
}

interface RecentUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalCategories: 0,
    activeProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/api/users/stats/dashboard');
      
      if (response.data.success) {
        setStats(response.data.stats);
        setRecentProducts(response.data.recentProducts || []);
        setRecentUsers(response.data.recentUsers || []);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Real Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          onClick={() => router.push('/admin/users')}
          className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
            </div>
            <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] p-4 rounded-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div
          onClick={() => router.push('/admin/products')}
          className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Products</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalProducts}</p>
              <p className="text-xs text-green-600 mt-1">{stats.activeProducts} active</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-xl">
              <Package className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div
          onClick={() => router.push('/admin/categories')}
          className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Categories</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalCategories}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl">
              <Grid3x3 className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Recent Products</h2>
          <button
            onClick={() => router.push('/admin/products')}
            className="text-[#FFA500] font-semibold hover:underline"
          >
            View All →
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {recentProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No products yet. 
              <button
                onClick={() => router.push('/admin/products/create')}
                className="ml-2 text-[#FFA500] font-semibold hover:underline"
              >
                Create your first product
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={getProductImageUrl(product.image)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const t = e.target as HTMLImageElement;
                              t.src = 'https://placehold.co/400x400/FFD700/white?text=No+Image';
                            }}
                          />
                        </div>
                        <p className="font-semibold text-gray-800 line-clamp-1">{product.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#FFA500]">₹{product.price}</td>
                    <td className="px-6 py-4 text-gray-700">{product.stock}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        product.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Recent Users */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Recent Users</h2>
          <button
            onClick={() => router.push('/admin/users')}
            className="text-[#FFA500] font-semibold hover:underline"
          >
            View All →
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {recentUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No users yet.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">User</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}