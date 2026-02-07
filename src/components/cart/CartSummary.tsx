'use client';

import { formatCurrency } from '@/lib/utils';
import Button from '@/components/common/Button';

interface CartSummaryProps {
  subtotal: number;
  onCheckout: () => void;
  isLoading?: boolean;
}

export default function CartSummary({ subtotal, onCheckout, isLoading }: CartSummaryProps) {
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-semibold text-green-600">FREE</span>
        </div>
        <div className="border-t pt-3 flex justify-between">
          <span className="text-lg font-bold">Total</span>
          <span className="text-xl font-bold text-[#FFA500]">{formatCurrency(total)}</span>
        </div>
      </div>

      <Button onClick={onCheckout} isLoading={isLoading} className="w-full">
        Proceed to Checkout
      </Button>
    </div>
  );
}