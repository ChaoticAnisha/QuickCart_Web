'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { User, Camera, LogOut, ShoppingCart, Package, MapPin, Mail, Phone, Edit, Save, X } from 'lucide-react';
import axiosInstance from '@/lib/axios';

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const cookieData = Cookies.get('quickcart_auth');
    if (!cookieData) {
      router.push('/login');
      return;
    }
    try {
      const parsed = JSON.parse(cookieData);
      setUserData(parsed.user);
      setEditData({
        name: parsed.user.name || '',
        phone: parsed.user.phone || '',
        address: parsed.user.address || '',
      });
    } catch (e) {
      router.push('/login');
    }
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userData?.id) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axiosInstance.post(
        `/api/users/${userData.id}/avatar`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // Update cookie with new avatar
      const cookieData = Cookies.get('quickcart_auth');
      if (cookieData) {
        const parsed = JSON.parse(cookieData);
        parsed.user.avatar = response.data.avatar || response.data.user?.avatar;
        Cookies.set('quickcart_auth', JSON.stringify(parsed), { expires: 7 });
        setUserData(parsed.user);
      }

      alert('Profile picture updated successfully!');
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      alert(error.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditData({
      name: userData.name || '',
      phone: userData.phone || '',
      address: userData.address || '',
    });
    setErrors({});
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!editData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (editData.phone && editData.phone.length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;
    if (!userData?.id) return;

    try {
      setIsSaving(true);

      const response = await axiosInstance.put(`/api/users/${userData.id}`, editData);

      // Update cookie with new data
      const cookieData = Cookies.get('quickcart_auth');
      if (cookieData) {
        const parsed = JSON.parse(cookieData);
        parsed.user = {
          ...parsed.user,
          name: editData.name,
          phone: editData.phone,
          address: editData.address,
        };
        Cookies.set('quickcart_auth', JSON.stringify(parsed), { expires: 7 });
        setUserData(parsed.user);
      }

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('quickcart_auth');
    router.push('/login');
  };

  const getAvatarUrl = () => {
    if (userData?.avatar) {
      return userData.avatar.startsWith('/uploads')
        ? `http://localhost:5000${userData.avatar}`
        : userData.avatar;
    }
    return null;
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFD700] to-[#FFA500] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">My Profile</h1>
          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 px-6 py-3 bg-white text-[#FFA500] rounded-2xl font-bold hover:shadow-lg transition-all hover:scale-105"
            >
              <Edit className="w-5 h-5" />
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center shadow-xl">
                {getAvatarUrl() ? (
                  <img
                    src={getAvatarUrl()!}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
              </div>

              {/* Camera Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-1 right-1 w-10 h-10 bg-white text-[#FFA500] rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg border-2 border-[#FFA500]"
                title="Change profile picture"
              >
                {isUploading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FFA500]"></div>
                ) : (
                  <Camera className="w-5 h-5" />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {isEditing ? (
              <div className="w-full max-w-md mt-4">
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => {
                    setEditData(prev => ({ ...prev, name: e.target.value }));
                    setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  className="text-center text-3xl font-bold text-gray-800 w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50"
                  placeholder="Your name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1 text-center">{errors.name}</p>}
              </div>
            ) : (
              <h2 className="text-3xl font-bold text-gray-800 mt-4">{userData.name}</h2>
            )}

            <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mt-2">
              Customer
            </span>
          </div>

          {/* Profile Details */}
          {isEditing ? (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Email (cannot be changed)</label>
                <div className="bg-gray-100 rounded-xl p-4">
                  <p className="text-gray-600">{userData.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Phone</label>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => {
                    setEditData(prev => ({ ...prev, phone: e.target.value }));
                    setErrors(prev => ({ ...prev, phone: '' }));
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50"
                  placeholder="Enter your phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Address</label>
                <textarea
                  value={editData.address}
                  onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 resize-none"
                  placeholder="Enter your address"
                />
              </div>

              {/* Save/Cancel Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-2xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <p className="text-sm font-bold text-gray-600">Email</p>
                </div>
                <p className="text-gray-800 font-semibold">{userData.email}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-bold text-gray-600">Phone</p>
                </div>
                <p className="text-gray-800 font-semibold">{userData.phone || 'Not provided'}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 md:col-span-2">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <p className="text-sm font-bold text-gray-600">Address</p>
                </div>
                <p className="text-gray-800 font-semibold">{userData.address || 'Not provided'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => router.push('/cart')}
            className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-3 hover:shadow-2xl transition-all hover:scale-105"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-[#FFA500]" />
            </div>
            <span className="font-bold text-gray-800 text-lg">My Cart</span>
          </button>

          <button
            onClick={() => router.push('/orders')}
            className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-3 hover:shadow-2xl transition-all hover:scale-105"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <span className="font-bold text-gray-800 text-lg">My Orders</span>
          </button>

          <button
            onClick={() => router.push('/products')}
            className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-3 hover:shadow-2xl transition-all hover:scale-105"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-green-600" />
            </div>
            <span className="font-bold text-gray-800 text-lg">Shop Now</span>
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-lg transition-all hover:scale-105"
        >
          <LogOut className="w-6 h-6" />
          Logout
        </button>
      </div>
    </div>
  );
}