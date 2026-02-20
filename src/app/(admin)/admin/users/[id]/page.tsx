'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getUserById } from '@/lib/admin.api';
import { API_BASE_URL } from '@/lib/constants';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, Shield, User as UserIcon } from 'lucide-react';
import Cookies from 'js-cookie';

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);
  

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await getUserById(userId);
      
      if (response.success) {
        setUser(response.user);
      } else {
        alert('Failed to load user details');
        router.push('/admin/users');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      alert('Failed to load user details');
      router.push('/admin/users');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAvatarUrl = (avatar?: string) => {
    if (!avatar) return 'https://placehold.co/200x200/FFD700/white?text=U';
    return `${API_BASE_URL.replace('/api', '')}${avatar}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-[#FFD700] to-[#FFA500]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFD700] to-[#FFA500] p-6">
        <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl shadow-xl p-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">User Not Found</h2>
          <button
            onClick={() => router.push('/admin/users')}
            className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-xl font-bold hover:shadow-lg"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFD700] to-[#FFA500] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin/users')}
            className="flex items-center gap-2 text-white hover:text-white/80 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Users</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">User Details</h1>
              <p className="text-white/80">View user information</p>
            </div>
            
            <button
              onClick={() => router.push(`/admin/users/${userId}/edit`)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-[#FFA500] rounded-2xl font-bold hover:shadow-lg transition-all"
            >
              <Edit className="w-5 h-5" />
              Edit User
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="text-center mb-6">
                <img
                  src={getAvatarUrl(user.avatar)}
                  alt={user.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg ring-4 ring-[#FFA500]/20"
                />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{user.name}</h2>
                <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${
                  user.role === 'admin' 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-green-100 text-green-600'
                }`}>
                  {user.role === 'admin' ? '👑 ADMIN' : '👤 USER'}
                </span>
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-4">
                <div className="flex items-start gap-3 text-sm">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500 font-medium">Member Since</p>
                    <p className="font-semibold text-gray-800">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
                
                {user.updatedAt !== user.createdAt && (
                  <div className="flex items-start gap-3 text-sm">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-500 font-medium">Last Updated</p>
                      <p className="font-semibold text-gray-800">{formatDate(user.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Personal Information</h3>
              
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-800 font-medium">{user.name}</span>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-800 font-medium">{user.email}</span>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-800 font-medium">{user.phone || 'Not provided'}</span>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-800 font-medium">{user.address || 'Not provided'}</span>
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    User Role
                  </label>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* User ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    User ID
                  </label>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <code className="text-gray-600 text-sm font-mono">{user.id}</code>
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