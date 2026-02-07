'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { ArrowLeft, MapPin, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { PAYMENT_METHODS, NEPALI_ADDRESSES } from '@/lib/constants';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalAmount, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    address: 'Kathmandu, Nepal',
    paymentMethod: 'Cash on Delivery',
    phone: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const orderId = Date.now().toString();

      clearCart();
      router.push(`/orders/${orderId}`);
    } catch (error) {
      console.error('Checkout error:', error);
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] p-4 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Cart</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-[#FFA500]" />
              <h2 className="text-xl font-bold text-gray-800">Delivery Address</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Address
                </label>
                <select
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full h-14 px-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500]"
                  required
                >
                  {NEPALI_ADDRESSES.map((addr) => (
                    <option key={addr} value={addr}>
                      {addr}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+977 9841234567"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500]"
                  placeholder="Any special instructions..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-6 h-6 text-[#FFA500]" />
              <h2 className="text-xl font-bold text-gray-800">Payment Method</h2>
            </div>

            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method}
                  className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                  style={{
                    borderColor: formData.paymentMethod === method ? '#FFA500' : '#E5E7EB',
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={formData.paymentMethod === method}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-5 h-5 text-[#FFA500]"
                  />
                  <span className="font-semibold text-gray-800">{method}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.product.name} x {item.quantity}
                  </span>
                  <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-[#FFA500]">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full h-14 text-lg">
            {isLoading ? 'Placing Order...' : 'Place Order'}
          </Button>
        </form>
      </div>
    </div>
  );
}