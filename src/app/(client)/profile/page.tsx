'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Edit, ShoppingCart, Package, ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
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
          });
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA500]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFD700] to-[#FFA500] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-white hover:text-white/80 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Dashboard</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-white/90">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-8 gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-800">{userData.name || 'User'}</h2>
                <p className="text-gray-600 text-lg">{userData.email}</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/profile/edit')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105"
            >
              <Edit className="w-5 h-5" />
              Edit Profile
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => router.push('/orders')}
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all hover:scale-105"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Package className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">My Orders</h3>
              <p className="text-sm text-gray-600">View order history</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/cart')}
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all hover:scale-105"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <ShoppingCart className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">My Cart</h3>
              <p className="text-sm text-gray-600">View shopping cart</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/profile/edit')}
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all hover:scale-105"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Edit className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Edit Profile</h3>
              <p className="text-sm text-gray-600">Update your info</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}