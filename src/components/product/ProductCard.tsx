'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Clock, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  isInCart?: boolean;
}

export default function ProductCard({ product, onAddToCart, isInCart }: ProductCardProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
      <div 
        onClick={() => router.push(`/products/${product.id}`)}
        className="relative w-full h-48"
      >
        <Image
          src={`/images/${product.image}`}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 
          onClick={() => router.push(`/products/${product.id}`)}
          className="font-bold text-gray-800 mb-2 line-clamp-2 h-12 hover:text-[#FFA500]"
        >
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1 mb-3">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400">{product.deliveryTime} MINS</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-baseline">
            <span className="text-[#FFA500] text-xl font-bold">
              {formatCurrency(product.price)}
            </span>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product);
            }}
            className={`h-9 px-4 rounded-lg shadow-md flex items-center gap-2 transition-all ${
              isInCart
                ? 'bg-gradient-to-r from-[#4CAF50] to-[#388E3C]'
                : 'bg-gradient-to-r from-[#FFD700] to-[#FFA500]'
            }`}
          >
            {isInCart ? (
              <>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white text-sm font-bold">Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-bold">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}