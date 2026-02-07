'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import { Order, OrderStatus } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { ORDER_STATUS } from '@/lib/constants';
import { ArrowLeft, Package } from 'lucide-react';

export default function AdminOrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    // TODO: Replace with actual API call
    setTimeout(() => {
      setOrder({
        id: orderId,
        userId: '1',
        user: {
          id: '1',
          name: 'Anisha Sah',
          email: 'anisha@example.com',
          role: 'client',
          address: 'Kathmandu, Nepal',
          phone: '+977 9841234567',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        items: [
          {
            id: '1',
            orderId: orderId,
            productId: '1',
            product: {
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
            quantity: 2,
            price: 79,
          },
          {
            id: '2',
            orderId: orderId,
            productId: '2',
            product: {
              id: '2',
              name: 'Royal Gulab Jamun',
              description: 'Sweet',
              price: 149,
              image: 'image 57.png',
              category: 'Diwali Gifts',
              stock: 30,
              deliveryTime: '16',
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            quantity: 1,
            price: 149,
          },
        ],
        totalAmount: 307,
        status: 'confirmed',
        deliveryAddress: 'Kathmandu, Nepal',
        paymentMethod: 'Cash on Delivery',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
      });
      setIsLoading(false);
    }, 500);
  };

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    
    // TODO: Replace with actual API call
    setTimeout(() => {
      if (order) {
        setOrder({ ...order, status: newStatus });
      }
      setIsUpdating(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Order not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Order #{order.id}</h1>
            <p className="text-gray-600 mt-1">{formatDateTime(order.createdAt)}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 pb-4 border-b last:border-0">
                  <img
                    src={`/images/${item.product.image}`}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(item.price)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-[#FFA500]">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Update Order Status</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.values(ORDER_STATUS).map((status) => (
                <Button
                  key={status}
                  variant={order.status === status ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusUpdate(status as OrderStatus)}
                  isLoading={isUpdating && order.status === status}
                  disabled={isUpdating}
                >
                  {status.replace(/_/g, ' ').toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Customer & Payment Info */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Customer</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold text-gray-800">{order.user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-800">{order.user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold text-gray-800">{order.user?.phone}</p>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Delivery</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-semibold text-gray-800">{order.deliveryAddress}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-semibold text-gray-800">{order.paymentMethod}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}