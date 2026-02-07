'use client';

import { ShoppingBag, DollarSign, Package, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`${color} p-4 rounded-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

interface DashboardStatsProps {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalUsers: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Orders"
        value={stats.totalOrders}
        icon={<ShoppingBag className="w-8 h-8 text-white" />}
        color="bg-gradient-to-r from-blue-500 to-blue-600"
      />
      <StatCard
        title="Total Revenue"
        value={formatCurrency(stats.totalRevenue)}
        icon={<DollarSign className="w-8 h-8 text-white" />}
        color="bg-gradient-to-r from-green-500 to-green-600"
      />
      <StatCard
        title="Total Products"
        value={stats.totalProducts}
        icon={<Package className="w-8 h-8 text-white" />}
        color="bg-gradient-to-r from-purple-500 to-purple-600"
      />
      <StatCard
        title="Total Users"
        value={stats.totalUsers}
        icon={<Users className="w-8 h-8 text-white" />}
        color="bg-gradient-to-r from-[#FFD700] to-[#FFA500]"
      />
    </div>
  );
}