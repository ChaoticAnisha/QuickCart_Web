/* eslint-disable react-hooks/immutability */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import Button from '@/components/common/Button';
import { Order } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { ArrowLeft, MapPin, CreditCard, Package } from 'lucide-react';

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setOrder({
        id: orderId,
        userId: '1',
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

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    setIsCancelling(true);
    
    setTimeout(() => {
      if (order) {
        setOrder({ ...order, status: 'cancelled' });
      }
      setIsCancelling(false);
    }, 1000);
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
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] p-4 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Orders</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Order Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Order #{order.id}</h1>
              <p className="text-gray-600">{formatDateTime(order.createdAt)}</p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-6 h-6 text-[#FFA500]" />
            <h2 className="text-xl font-bold text-gray-800">Order Items</h2>
          </div>

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
                  <p className="font-bold text-gray-800">{formatCurrency(item.price * item.quantity)}</p>
                  <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <span className="text-xl font-bold text-gray-800">Total</span>
            <span className="text-2xl font-bold text-[#FFA500]">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-6 h-6 text-[#FFA500]" />
            <h2 className="text-xl font-bold text-gray-800">Delivery Information</h2>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-semibold text-gray-800">{order.deliveryAddress}</p>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-6 h-6 text-[#FFA500]" />
            <h2 className="text-xl font-bold text-gray-800">Payment Method</h2>
          </div>

          <p className="font-semibold text-gray-800">{order.paymentMethod}</p>
        </div>

        {/* Cancel Order */}
        {order.status === 'pending' || order.status === 'confirmed' ? (
          <Button
            variant="danger"
            onClick={handleCancelOrder}
            isLoading={isCancelling}
            className="w-full"
          >
            Cancel Order
          </Button>
        ) : null}
      </div>
    </div>
  );
}