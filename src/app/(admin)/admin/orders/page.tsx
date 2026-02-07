'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/admin/DataTable';
import Pagination from '@/components/common/Pagination';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import { Order } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { usePagination } from '@/hooks/usePagination';
import { Filter } from 'lucide-react';

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const pagination = usePagination({
    totalItems: orders.length,
    itemsPerPage: 10,
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    
    // TODO: Replace with actual API call
    setTimeout(() => {
      setOrders([
        {
          id: '1',
          userId: '1',
          items: [],
          totalAmount: 307,
          status: 'confirmed',
          deliveryAddress: 'Kathmandu, Nepal',
          paymentMethod: 'Cash on Delivery',
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date('2024-02-01'),
        },
        {
          id: '2',
          userId: '2',
          items: [],
          totalAmount: 450,
          status: 'processing',
          deliveryAddress: 'Lalitpur, Nepal',
          paymentMethod: 'Khalti',
          createdAt: new Date('2024-02-02'),
          updatedAt: new Date('2024-02-02'),
        },
        {
          id: '3',
          userId: '1',
          items: [],
          totalAmount: 199,
          status: 'delivered',
          deliveryAddress: 'Kathmandu, Nepal',
          paymentMethod: 'eSewa',
          createdAt: new Date('2024-01-28'),
          updatedAt: new Date('2024-01-29'),
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const filteredOrders = orders.filter(order => {
    if (!statusFilter) return true;
    return order.status === statusFilter;
  });

  const paginatedOrders = filteredOrders.slice(
    pagination.startIndex,
    pagination.endIndex
  );

  const columns = [
    {
      header: 'Order ID',
      accessor: (order: Order) => `#${order.id}`,
    },
    {
      header: 'Customer',
      accessor: (order: Order) => order.deliveryAddress,
    },
    {
      header: 'Amount',
      accessor: (order: Order) => formatCurrency(order.totalAmount),
    },
    {
      header: 'Payment',
      accessor: (order: Order) => order.paymentMethod,
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <p className="text-gray-600 mt-1">Manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <DataTable
        data={paginatedOrders}
        columns={columns}
        onRowClick={(order) => router.push(`/admin/orders/${order.id}`)}
      />

      {/* Pagination */}
      {filteredOrders.length > 10 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.goToPage}
        />
      )}
    </div>
  );
}