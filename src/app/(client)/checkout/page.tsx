'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { createOrder } from '@/lib/orders.api';
import { getProductImageUrl } from '@/lib/products.api';
import KhaltiPayment from '@/components/payment/KhaltiPayment';
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
    note: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'khalti'>('cod');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const cookieData = Cookies.get('quickcart_auth');
    if (cookieData) {
      try {
        const parsed = JSON.parse(cookieData);
        setUserData(parsed.user);
        if (parsed.user?.address) {
          setFormData(prev => ({
            ...prev,
            deliveryAddress: parsed.user.address,
          }));
        }
      } catch (e) {
        console.error('Error parsing cookie:', e);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (cart.length === 0 && !orderSuccess) {
        router.push('/products');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [cart, orderSuccess, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    } else if (formData.deliveryAddress.length < 10) {
      newErrors.deliveryAddress = 'Please enter a complete address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* =========================
     COD ORDER HANDLER
  ========================== */
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
          name: item.product?.name || '',
          image: item.product?.image || '',
          price: item.product?.price || item.price || 0,
          quantity: item.quantity,
        })),
        totalAmount: getTotal(),
        deliveryAddress: formData.deliveryAddress,
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'pending',
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
      alert(error.message || 'Failed to place order.');
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     KHALTI SUCCESS HANDLER
  ========================== */
  const handlePaymentSuccess = async (payload: any) => {
    if (!validateForm()) return;

    try {
      const orderData = {
        userId: userData.id,
        items: cart.map(item => ({
          productId: item.productId,
          name: item.product?.name || '',
          image: item.product?.image || '',
          price: item.product?.price || item.price || 0,
          quantity: item.quantity,
        })),
        totalAmount: getTotal(),
        deliveryAddress: formData.deliveryAddress,
        paymentMethod: 'Khalti',
        paymentStatus: 'paid',
        khaltiPaymentId: payload.idx,
        khaltiTransactionId: payload.transaction_id,
        note: formData.note,
      };

      const response = await createOrder(orderData);

      if (response.success) {
        clearCart();
        setOrderSuccess(true);
        setOrderId(response.order._id);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Payment successful but order creation failed.');
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error);
    alert('Payment failed. Please try again.');
  };

  /* =========================
     ORDER SUCCESS SCREEN
  ========================== */
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFD700] to-[#FFA500] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-14 h-14 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Order Placed!
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            Order ID: #{orderId.slice(-8).toUpperCase()}
          </p>

          <button
            onClick={() => router.push('/orders')}
            className="w-full py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-2xl font-bold"
          >
            Track My Order
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     MAIN CHECKOUT UI
  ========================== */
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFD700] to-[#FFA500] p-6">
      <div className="max-w-4xl mx-auto">

        <button
          onClick={() => router.push('/cart')}
          className="flex items-center gap-2 text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cart
        </button>

        <h1 className="text-4xl font-bold text-white mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">

            {/* ADDRESS */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#FFA500]" />
                Delivery Address
              </h2>

              <textarea
                value={formData.deliveryAddress}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    deliveryAddress: e.target.value,
                  }))
                }
                rows={4}
                className="w-full px-4 py-3 border rounded-xl"
              />
              {errors.deliveryAddress && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.deliveryAddress}
                </p>
              )}
            </div>

            {/* PAYMENT METHOD */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-4">
                Payment Method
              </h3>

              {/* COD */}
              <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer mb-3">
                <input
                  type="radio"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <div className="flex-1">
                  <p className="font-semibold">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">
                    Pay when you receive
                  </p>
                </div>
              </label>

              {/* KHALTI */}
              <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer">
                <input
                  type="radio"
                  checked={paymentMethod === 'khalti'}
                  onChange={() => setPaymentMethod('khalti')}
                />
                <div className="flex-1">
                  <p className="font-semibold">Khalti Payment</p>
                  <p className="text-sm text-gray-500">
                    Pay instantly with Khalti wallet
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">

            <h2 className="text-xl font-bold mb-4">
              Order Summary ({cart.length} items)
            </h2>

            <div className="mb-4 space-y-3 max-h-60 overflow-y-auto">
              {cart.map(item => (
                <div key={item.productId} className="flex gap-3">
                  <img
                    src={getProductImageUrl(item.product?.image || '')}
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      {item.product?.name}
                    </p>
                    <p className="text-sm">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span>₹{getTotal()}</span>
            </div>

            {/* PAYMENT BUTTON SECTION */}
            {paymentMethod === 'cod' ? (
              <button
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-2xl font-bold"
              >
                {isLoading
                  ? 'Placing Order...'
                  : `Place Order (COD) • ₹${getTotal()}`}
              </button>
            ) : (
              <KhaltiPayment
                amount={getTotal()}
                orderId={`ORDER-${Date.now()}`}
                productName="QuickCart Order"
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}