'use client';

import { useEffect, useState } from 'react';
import DashboardStats from '@/components/admin/DashboardStats';
import DataTable from '@/components/admin/DataTable';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Order, Product } from '@/types';
import { TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setStats({
        totalOrders: 1234,
        totalRevenue: 98765.50,
        totalProducts: 456,
        totalUsers: 789,
      });

      setRecentOrders([
        {
          id: '1',
          userId: '1',
          items: [],
          totalAmount: 307,
          status: 'confirmed',
          deliveryAddress: 'Kathmandu, Nepal',
          paymentMethod: 'Cash on Delivery',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          userId: '2',
          items: [],
          totalAmount: 450,
          status: 'processing',
          deliveryAddress: 'Lalitpur, Nepal',
          paymentMethod: 'Khalti',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      setTopProducts([
        {
          id: '1',
          name: 'Golden Glass Wooden Lid Candle',
          description: 'Premium candle',
          price: 79,
          image: 'image 54.png',
          category: 'Lights, Diyas & Candles',
          stock: 50,
          deliveryTime: '16',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      setIsLoading(false);
    }, 1000);
  };

  const orderColumns = [
    {
      header: 'Order ID',
      accessor: (order: Order) => `#${order.id}`,
    },
    {
      header: 'Amount',
      accessor: (order: Order) => formatCurrency(order.totalAmount),
    },
    {
      header: 'Status',
      accessor: (order: Order) => <OrderStatusBadge status={order.status} />,
    },
    {
      header: 'Date',
      accessor: (order: Order) => formatDateTime(order.createdAt),
    },
  ];

  const productColumns = [
    {
      header: 'Product',
      accessor: (product: Product) => product.name,
    },
    {
      header: 'Price',
      accessor: (product: Product) => formatCurrency(product.price),
    },
    {
      header: 'Stock',
      accessor: (product: Product) => product.stock,
    },
    {
      header: 'Category',
      accessor: (product: Product) => product.category,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Heren&apose;s whatn&apos;s happening today.</p>
      </div>

      <DashboardStats stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Revenue Overview</h2>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart will be displayed here
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Orders Overview</h2>
            <TrendingUp className="w-6 h-6 text-blue-500" />
          </div>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart will be displayed here
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Orders</h2>
        <DataTable data={recentOrders} columns={orderColumns} />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Top Products</h2>
        <DataTable data={topProducts} columns={productColumns} />
      </div>
    </div>
  );
}
//huh