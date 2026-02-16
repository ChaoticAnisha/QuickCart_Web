'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, Save, X, Mail, Phone, MapPin, Calendar, Shield, User as UserIcon } from 'lucide-react';
import { getUserById, updateUser, User, UpdateUserPayload } from '@/lib/users.api';

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'user',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await getUserById(userId);
      
      setUser(response.user);
      setFormData({
        name: response.user.name,
        email: response.user.email,
        phone: response.user.phone || '',
        address: response.user.address || '',
        role: response.user.role,
        password: '',
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      alert('Failed to load user details');
      router.push('/admin/users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);

      const updatePayload: UpdateUserPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        role: formData.role,
      };

      // Only include password if it was changed
      if (formData.password) {
        updatePayload.password = formData.password;
      }

      const response = await updateUser(userId, updatePayload);
      
      setUser(response.user);
      setIsEditing(false);
      alert('User updated successfully!');
      
      // Refresh data
      await fetchUser();
    } catch (error: any) {
      console.error('Error updating user:', error);
      alert(error.message || 'Failed to update user');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        role: user.role,
        password: '',
      });
    }
    setErrors({});
    setIsEditing(false);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA500]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center">
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
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/admin/users')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Users</span>
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">User Details</h1>
            <p className="text-gray-600">View and manage user information</p>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105"
            >
              <Edit className="w-5 h-5" />
              Edit User
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="text-center mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] flex items-center justify-center text-white text-5xl font-bold mx-auto mb-4 shadow-lg relative">
                {user.name.charAt(0).toUpperCase()}
                {user.role === 'admin' && (
                  <div className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.name}</h2>
              <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${
                user.role === 'admin' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {user.role === 'admin' ? '👑 ADMIN' : '👤 USER'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-500">Joined</p>
                  <p className="font-semibold text-gray-800">{formatDate(user.createdAt)}</p>
                </div>
              </div>
              
              {user.updatedAt !== user.createdAt && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Last Updated</p>
                    <p className="font-semibold text-gray-800">{formatDate(user.updatedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Details Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Personal Information</h3>
            
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50"
                      placeholder="Enter full name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-800 font-medium">{user.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50"
                      placeholder="Enter email"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-800 font-medium">{user.email}</span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50"
                    placeholder="+977 9841234567"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-800 font-medium">{user.phone || 'Not provided'}</span>
                  </div>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50"
                    placeholder="Enter address"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-800 font-medium">{user.address || 'Not provided'}</span>
                  </div>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  User Role *
                </label>
                {isEditing ? (
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Password (only in edit mode) */}
              {isEditing && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password (leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50"
                    placeholder="Enter new password (optional)"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  <p className="text-sm text-gray-500 mt-1">Minimum 6 characters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}