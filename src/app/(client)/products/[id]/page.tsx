'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, Clock, Package } from 'lucide-react';

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const { addToCart, isInCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = () => {
    setIsLoading(true);
    
    // TODO: Replace with actual API call
    setTimeout(() => {
      setProduct({
        id: productId,
        name: 'Golden Glass Wooden Lid Candle',
        description: 'Premium scented candle with wooden lid, perfect for creating a warm ambiance',
        price: 79,
        image: 'image 54.png',
        category: 'Lights, Diyas & Candles',
        stock: 50,
        deliveryTime: '16',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setIsLoading(false);
    }, 500);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      router.push('/cart');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] p-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white hover:text-white/90"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Product Image */}
            <div className="relative h-96 bg-gray-100 rounded-xl overflow-hidden">
              <Image
                src={`/images/${product.image}`}
                alt={product.name}
                fill
                className="object-contain"
              />
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>
              <p className="text-gray-600 mb-4">{product.description}</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {product.deliveryTime} mins
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {product.stock} in stock
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-[#FFA500]">
                  {formatCurrency(product.price)}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white flex items-center justify-center hover:shadow-lg transition-shadow"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button onClick={handleAddToCart} className="w-full">
                {isInCart(product.id) ? 'Update Cart' : 'Add to Cart'}
              </Button>

              {/* Product Info */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-bold text-gray-800 mb-3">Product Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Time:</span>
                    <span className="font-medium">{product.deliveryTime} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Availability:</span>
                    <span className="font-medium text-green-600">In Stock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}