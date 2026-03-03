'use client';

import { useState, useEffect } from 'react';
import { getAnalytics } from '@/lib/analytics.api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign, Package } from 'lucide-react';

const COLORS = ['#FFD700', '#FFA500', '#FF8C00', '#FF6347', '#FF4500'];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await getAnalytics();
      if (response.success) {
        setAnalytics(response);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      alert('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FFA500] border-t-transparent"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6">
        <p className="text-center text-gray-500">Failed to load analytics</p>
      </div>
    );
  }

  const { stats, userGrowth, ordersByStatus, revenueOverTime, topProducts } = analytics;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Overview of your business performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-bold">{stats.totalUsers}</h3>
          <p className="text-blue-100 text-sm mt-1">Total Users</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-8 h-8" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-bold">{stats.totalProducts}</h3>
          <p className="text-green-100 text-sm mt-1">Total Products</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <ShoppingBag className="w-8 h-8" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-bold">{stats.totalOrders}</h3>
          <p className="text-purple-100 text-sm mt-1">Total Orders</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-bold">Rs. {stats.totalRevenue.toLocaleString()}</h3>
          <p className="text-orange-100 text-sm mt-1">Total Revenue</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-8 h-8" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-bold">{stats.totalCategories}</h3>
          <p className="text-pink-100 text-sm mt-1">Categories</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">User Growth (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#FFD700" strokeWidth={3} name="New Users" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Orders by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ordersByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => {
                  const e = entry as unknown as { _id: string; count: number };
                  return `${e._id}: ${e.count}`;
                }}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {ordersByStatus.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Over Time */}
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Revenue Over Time (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#FFA500" name="Revenue (Rs.)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Top 5 Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white">
              <tr>
                <th className="px-6 py-3 text-left font-bold">Product</th>
                <th className="px-6 py-3 text-right font-bold">Units Sold</th>
                <th className="px-6 py-3 text-right font-bold">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topProducts.map((product: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-800">{product._id?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{product.totalSold}</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-800">
                    Rs. {product.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}