/* eslint-disable react-hooks/immutability */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import { Order } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Package } from 'lucide-react';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setIsLoading(true);
    
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
          userId: '1',
          items: [],
          totalAmount: 450,
          status: 'delivered',
          deliveryAddress: 'Kathmandu, Nepal',
          paymentMethod: 'Khalti',
          createdAt: new Date('2024-01-28'),
          updatedAt: new Date('2024-01-29'),
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

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
        <h1 className="text-3xl font-bold text-white text-center">My Orders</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
            <p className="text-gray-600">Start shopping to see your orders here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => router.push(`/orders/${order.id}`)}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">{formatDateTime(order.createdAt)}</p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-[#FFA500]">{formatCurrency(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment:</span>
                    <span className="font-semibold">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery:</span>
                    <span className="font-semibold">{order.deliveryAddress}</span>
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