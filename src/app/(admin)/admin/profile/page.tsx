'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, LogOut, ShoppingCart, Package, Shield } from 'lucide-react';

export default function AdminProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    role: 'admin',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      const authCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('quickcart_auth='));

      if (authCookie) {
        const authData = JSON.parse(decodeURIComponent(authCookie.split('=')[1]));
        if (authData.user) {
          setUserData({
            name: authData.user.name || '',
            email: authData.user.email || '',
            phone: authData.user.phone || '',
            address: authData.user.address || '',
            avatar: authData.user.avatar || '',
            role: authData.user.role || 'admin',
          });
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = 'quickcart_auth=; path=/; max-age=0';
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA500]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Profile</h1>
          <p className="text-gray-600">Manage your administrator account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-8 gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg relative">
                {userData.name ? userData.name.charAt(0).toUpperCase() : 'A'}
                <div className="absolute bottom-0 right-0 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full p-2 shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-800">{userData.name || 'Administrator'}</h2>
                <p className="text-gray-600 text-lg">{userData.email}</p>
                <span className="inline-block mt-2 px-4 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 rounded-full text-sm font-bold">
                  👑 ADMIN
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="p-3 bg-blue-500 rounded-lg shadow-md">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1 font-semibold">Email Address</p>
                <p className="text-gray-800 font-medium">{userData.email || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="p-3 bg-green-500 rounded-lg shadow-md">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1 font-semibold">Phone Number</p>
                <p className="text-gray-800 font-medium">{userData.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 md:col-span-2 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
              <div className="p-3 bg-orange-500 rounded-lg shadow-md">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1 font-semibold">Address</p>
                <p className="text-gray-800 font-medium">{userData.address || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => router.push('/admin/users')}
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all hover:scale-105"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Manage Users</h3>
              <p className="text-sm text-gray-600">View and manage all users</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/admin/products')}
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all hover:scale-105"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <ShoppingCart className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Manage Products</h3>
              <p className="text-sm text-gray-600">View and manage products</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/admin/orders')}
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all hover:scale-105"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Package className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Manage Orders</h3>
              <p className="text-sm text-gray-600">View and manage orders</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}