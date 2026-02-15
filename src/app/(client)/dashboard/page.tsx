'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types';
import { 
  ShoppingCart, 
  Bell, 
  User, 
  Search,
  Home,
  Grid3x3,
  LogOut,
  Package,
  Clock
} from 'lucide-react';

export default function ClientDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { addToCart, isInCart, itemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUserData = () => {
      try {
        const authCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('quickcart_auth='));

        if (authCookie) {
          const authData = JSON.parse(decodeURIComponent(authCookie.split('=')[1]));
          if (authData.user) {
            setUserName(authData.user.name || authData.user.email.split('@')[0]);
            setUserAvatar(authData.user.avatar || '');
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  const categories = [
    { img: 'image 50.png', text: 'Lights, Diyas & Candles' },
    { img: 'image 51.png', text: 'Diwali Gifts' },
    { img: 'image 52.png', text: 'Appliances & Gadgets' },
    { img: 'image 39.png', text: 'Home & Living' },
    { img: 'image 41.png', text: 'Vegetables & Fruits' },
    { img: 'image 42.png', text: 'Atta, Dal & Rice' },
    { img: 'image 43.png', text: 'Oil, Ghee & Masala' },
    { img: 'image 44 (1).png', text: 'Dairy, Bread & Milk' },
  ];

  const popularProducts: Product[] = [
    {
      id: '1',
      name: 'Golden Glass Wooden Lid Candle',
      description: 'Premium scented candle',
      price: 79,
      image: 'image 54.png',
      category: 'Lights, Diyas & Candles',
      stock: 50,
      deliveryTime: '16',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Royal Gulab Jamun By Bikano',
      description: 'Authentic sweets',
      price: 149,
      image: 'image 57.png',
      category: 'Diwali Gifts',
      stock: 30,
      deliveryTime: '16',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      name: 'Premium Scented Candle',
      description: 'Luxury candle',
      price: 79,
      image: 'image 63.png',
      category: 'Lights, Diyas & Candles',
      stock: 45,
      deliveryTime: '16',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      name: 'Decorative Items Set',
      description: 'Beautiful decorations',
      price: 199,
      image: 'image 33.png',
      category: 'Home & Living',
      stock: 25,
      deliveryTime: '20',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: ShoppingCart, label: 'Orders', path: '/orders' },
    { icon: Grid3x3, label: 'Categories', path: '/categories' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const handleLogout = () => {
    document.cookie = 'quickcart_auth=; path=/; max-age=0';
    router.push('/');
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA500]"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
            QuickCart Users
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium flex-1 text-left">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout - At the end */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold">
              {userName ? userName.charAt(0).toUpperCase() : 'N'}
            </div>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {userName || 'Guest'}! Here's what's happening today.</p>
          </div>

          {/* Categories Section with Gold Background */}
          <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((item, index) => (
                <button
                  key={index}
                  onClick={() => router.push('/categories')}
                  className="bg-white rounded-xl p-4 flex flex-col items-center gap-3 hover:shadow-xl transition-all hover:scale-105"
                >
                  <div className="relative w-24 h-24">
                    <Image 
                      src={`/images/${item.img}`} 
                      alt={item.text} 
                      fill 
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                  <span className="font-semibold text-gray-800 text-center text-sm">{item.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Cart Items</p>
                  <p className="text-3xl font-bold text-gray-800">{itemCount}</p>
                </div>
                <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] p-4 rounded-xl">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-800">12</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl">
                  <Package className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Delivery Time</p>
                  <p className="text-3xl font-bold text-gray-800">16 min</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl">
                  <Clock className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Popular Products */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Popular Products</h2>
              <button 
                onClick={() => router.push('/products')}
                className="text-[#FFA500] font-semibold hover:underline"
              >
                View All →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative w-full h-48 bg-gray-50">
                    <Image 
                      src={`/images/${product.image}`} 
                      alt={product.name} 
                      fill 
                      className="object-contain p-4"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 h-12">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-400">{product.deliveryTime} MINS</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#FFA500] text-xl font-bold">₹{product.price}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                          isInCart(product.id)
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                            : 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white hover:shadow-lg'
                        }`}
                      >
                        {isInCart(product.id) ? 'Added' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}