'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/types';
import { cartAPI } from '@/lib/api';

interface CartContextType {
  cart: CartItem[];
  itemCount: number;
  totalAmount: number;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    loadCart();

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
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    cartAPI.add({ productId: product.id, product, quantity });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      cartAPI.update(itemId, quantity);
    }
  };

  const removeFromCart = (itemId: string) => {
    cartAPI.remove(itemId);
  };

  const clearCart = () => {
    cartAPI.clear();
  };

  const isInCart = (productId: string) => {
    return cart.some(item => item.productId === productId);
  };

  const getItemQuantity = (productId: string) => {
    const item = cart.find(item => item.productId === productId);
    return item?.quantity || 0;
  };

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        totalAmount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}