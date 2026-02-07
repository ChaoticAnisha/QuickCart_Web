'use client';

import { useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';
import { cartAPI } from '@/lib/api';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart on mount
  useEffect(() => {
    loadCart();
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, []);

  const loadCart = () => {
    const cartData = cartAPI.get();
    setCart(cartData);
    setIsLoading(false);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    cartAPI.add({ productId: product.id, product, quantity });
    loadCart();
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      cartAPI.update(itemId, quantity);
      loadCart();
    }
  };

  const removeFromCart = (itemId: string) => {
    cartAPI.remove(itemId);
    loadCart();
  };

  const clearCart = () => {
    cartAPI.clear();
    loadCart();
  };

  const isInCart = (productId: string) => {
    return cart.some(item => item.productId === productId);
  };

  const getItemQuantity = (productId: string) => {
    const item = cart.find(item => item.productId === productId);
    return item?.quantity || 0;
  };

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const totalAmount = cart.reduce(
    (total, item) => total + (item.price * item.quantity), 
    0
  );

  return {
    cart,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isInCart,
    getItemQuantity,
    itemCount,
    totalAmount,
  };
}