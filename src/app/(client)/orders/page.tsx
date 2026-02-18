'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserOrders, Order, getStatusColor, getStatusLabel } from '@/lib/orders.api';
import { getProductImageUrl } from '@/lib/products.api';
import Cookies from 'js-cookie';
import { ArrowLeft, Package, Clock } from 'lucide-react';

export default function ClientOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const cookieData = Cookies.get('quickcart_auth');
    if (cookieData) {
      try {
        const parsed = JSON.parse(cookieData);
        if (parsed.user?.id) {
          setUserId(parsed.user.id);
          loadOrders(parsed.user.id);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const loadOrders = async (uid: string) => {
    try {
      setIsLoading(true);
      const response = await getUserOrders(uid);
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFD700] to-[#FFA500] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFD700] to-[#FFA500] p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-white hover:text-white/80 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Dashboard</span>
        </button>

        <h1 className="text-4xl font-bold text-white mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h3>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <button
              onClick={() => router.push('/products')}
              className="px-8 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-xl font-bold hover:shadow-lg"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-xl p-6">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-bold text-gray-800">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                        <img
                          src={getProductImageUrl(item.image)}
                          alt={item.name}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            const t = e.target as HTMLImageElement;
                            t.src = 'https://placehold.co/100x100/FFD700/white?text=P';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <p className="font-bold text-[#FFA500]">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-bold text-[#FFA500]">₹{order.totalAmount}</p>
                  </div>
                </div>

                <div className="mt-3 text-sm text-gray-500">
                  📍 {order.deliveryAddress} | 💳 {order.paymentMethod}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}