'use client';

import { CartItem as CartItemType } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl shadow-lg p-4">
      <img
        src={`/images/${item.product.image}`}
        alt={item.product.name}
        className="w-20 h-20 rounded-lg object-cover"
      />
      
      <div className="flex-1">
        <h3 className="font-bold text-gray-800">{item.product.name}</h3>
        <p className="text-[#FFA500] font-bold">{formatCurrency(item.price)}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center hover:bg-gray-300"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-bold">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center text-white"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}