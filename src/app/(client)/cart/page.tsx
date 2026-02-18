'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { getProductImageUrl } from '@/lib/products.api';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart, getTotal, getCount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFD700] to-[#FFA500] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Cart is Empty</h2>
          <p className="text-gray-500 mb-8">Add some products to your cart to get started!</p>
          <button
            onClick={() => router.push('/products')}
            className="w-full py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-2xl font-bold text-lg hover:shadow-lg transition-all hover:scale-105"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFD700] to-[#FFA500] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.push('/products')}
          className="flex items-center gap-2 text-white hover:text-white/80 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Continue Shopping</span>
        </button>

        <h1 className="text-4xl font-bold text-white mb-8">
          My Cart ({getCount()} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.productId} className="bg-white rounded-2xl shadow-xl p-4 flex gap-4">
                {/* Image */}
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                  <img
                    src={getProductImageUrl(item.product?.image || item.image || '')}
                    alt={item.product?.name || item.name || 'Product'}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      const t = e.target as HTMLImageElement;
                      t.src = 'https://placehold.co/200x200/FFD700/white?text=Product';
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1 line-clamp-2">
                    {item.product?.name || item.name || 'Product'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {item.product?.category || item.category || ''}
                  </p>
                  <p className="text-[#FFA500] font-bold text-lg">
                    ₹{item.product?.price || item.price || 0}
                  </p>
                </div>

                {/* Quantity + Delete */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow text-gray-700 hover:bg-gray-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-gray-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow text-gray-700 hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="text-white/80 hover:text-white text-sm font-semibold underline"
            >
              Clear entire cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {cart.map((item) => {
                  const itemPrice = item.product?.price || item.price || 0;
                  const itemName = item.product?.name || item.name || 'Product';
                  
                  return (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-gray-600 line-clamp-1 flex-1">
                        {itemName} × {item.quantity}
                      </span>
                      <span className="font-semibold text-gray-800 ml-2">
                        ₹{itemPrice * item.quantity}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{getTotal()}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-[#FFA500]">₹{getTotal()}</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-2xl font-bold text-lg hover:shadow-lg transition-all hover:scale-105"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => router.push('/products')}
                className="w-full py-3 mt-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}