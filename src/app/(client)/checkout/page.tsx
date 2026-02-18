'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { createOrder } from '@/lib/orders.api';
import { getProductImageUrl } from '@/lib/products.api';
import Cookies from 'js-cookie';
import { ArrowLeft, MapPin, CreditCard, CheckCircle } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getTotal, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [userData, setUserData] = useState<any>(null);

  const [formData, setFormData] = useState({
    deliveryAddress: '',
    paymentMethod: 'Cash on Delivery',
    note: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load user data from cookie
    const cookieData = Cookies.get('quickcart_auth');
    if (cookieData) {
      try {
        const parsed = JSON.parse(cookieData);
        setUserData(parsed.user);
        // Pre-fill address from profile
        if (parsed.user?.address) {
          setFormData(prev => ({ ...prev, deliveryAddress: parsed.user.address }));
        }
      } catch (e) {
        console.error('Error parsing cookie:', e);
      }
    }
  }, []);

  // Redirect if cart is empty (with loading check)
useEffect(() => {
  // Wait for cart to load before redirecting
  const timer = setTimeout(() => {
    if (cart.length === 0 && !orderSuccess) {
      router.push('/products');
    }
  }, 500); // Wait 500ms for cart to load

  return () => clearTimeout(timer);
}, [cart, orderSuccess, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    } else if (formData.deliveryAddress.length < 10) {
      newErrors.deliveryAddress = 'Please enter a complete address';
    }
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    if (!userData?.id) {
      alert('Please login to place an order');
      router.push('/login');
      return;
    }

    try {
      setIsLoading(true);

      const orderData = {
        userId: userData.id,
        items: cart.map(item => ({
          productId: item.productId,
          name: item.product?.name || item.name || '',
          image: item.product?.image || item.image || '',
          price: item.product?.price || item.price || 0,
          quantity: item.quantity,
        })),
        totalAmount: getTotal(),
        deliveryAddress: formData.deliveryAddress,
        paymentMethod: formData.paymentMethod,
        note: formData.note,
      };

      const response = await createOrder(orderData);

      if (response.success) {
        setOrderId(response.order._id);
        setOrderSuccess(true);
        clearCart();
      }
    } catch (error: any) {
      console.error('Error placing order:', error);
      alert(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Order Success Screen
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFD700] to-[#FFA500] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-14 h-14 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Order Placed! 🎉</h2>
          <p className="text-gray-500 mb-2">Your order has been placed successfully.</p>
          <p className="text-sm text-gray-400 mb-8">Order ID: #{orderId.slice(-8).toUpperCase()}</p>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/orders')}
              className="w-full py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-2xl font-bold text-lg hover:shadow-lg transition-all"
            >
              Track My Order
            </button>
            <button
              onClick={() => router.push('/products')}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFD700] to-[#FFA500] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.push('/cart')}
          className="flex items-center gap-2 text-white hover:text-white/80 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Cart</span>
        </button>

        <h1 className="text-4xl font-bold text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#FFA500]" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Delivery Address</h2>
              </div>

              <textarea
                value={formData.deliveryAddress}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, deliveryAddress: e.target.value }));
                  setErrors(prev => ({ ...prev, deliveryAddress: '' }));
                }}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 resize-none"
                placeholder="Enter your full delivery address..."
              />
              {errors.deliveryAddress && (
                <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#FFA500]" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {[
                  { value: "Cash on Delivery", label: "💵 Cash on Delivery", desc: "Pay when your order arrives" },
                  { value: "Khalti", label: "💜 Khalti", desc: "Pay via Khalti digital wallet" },
                  { value: "eSewa", label: "🟢 eSewa", desc: "Pay via eSewa digital wallet" },
                  { value: "Bank Transfer", label: "🏦 Bank Transfer", desc: "Direct bank transfer" },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === method.value
                        ? 'border-[#FFA500] bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="accent-[#FFA500]"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{method.label}</p>
                      <p className="text-sm text-gray-500">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              {errors.paymentMethod && (
                <p className="text-red-500 text-sm mt-2">{errors.paymentMethod}</p>
              )}
            </div>

            {/* Note */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Note (Optional)</h2>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 resize-none"
                placeholder="Any special instructions for your order..."
              />
            </div>
          </div>

          {/* Right - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Order Summary ({cart.length} items)
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                      <img
                        src={getProductImageUrl(item.product?.image || item.image || '')}
                        alt={item.product?.name || item.name || 'Product'}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          const t = e.target as HTMLImageElement;
                          t.src = 'https://placehold.co/100x100/FFD700/white?text=P';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                        {item.product?.name || item.name || 'Product'}
                      </p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-[#FFA500]">
                        ₹{(item.product?.price || item.price || 0) * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{getTotal()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-[#FFA500]">₹{getTotal()}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-2xl font-bold text-lg hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                {isLoading ? 'Placing Order...' : `Place Order • ₹${getTotal()}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}