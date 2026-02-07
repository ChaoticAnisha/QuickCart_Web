'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { User } from '@/types';
import { formatDateTime, getInitials } from '@/lib/utils';
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from 'lucide-react';

export default function AdminUserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    // TODO: Replace with actual API call
    setTimeout(() => {
      setUser({
        id: userId,
        name: 'Anisha Sah',
        email: 'anisha@example.com',
        role: 'client',
        address: 'Kathmandu, Nepal',
        phone: '+977 9841234567',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      });
      setIsLoading(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      {/* User Profile */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] p-8 text-center">
          <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center mb-4">
            <span className="text-3xl font-bold text-[#FFA500]">
              {getInitials(user.name)}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{user.name}</h1>
          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold ${
              user.role === 'admin'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {user.role.toUpperCase()}
          </span>
        </div>

        {/* Details */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-800">{user.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold text-gray-800">{user.phone || 'N/A'}</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-semibold text-gray-800">{user.address || 'N/A'}</p>
              </div>
            </div>

            {/* Joined Date */}
            <div className="flex items-start gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-semibold text-gray-800">
                  {formatDateTime(user.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t flex gap-4">
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/users/edit/${user.id}`)}
              className="flex-1"
            >
              Edit User
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (confirm('Are you sure you want to delete this user?')) {
                  // TODO: API call to delete
                  router.push('/admin/users');
                }
              }}
              className="flex-1"
            >
              Delete User
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Activity (Placeholder) */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="text-center py-8 text-gray-500">
          No recent activity
        </div>
      </div>
    </div>
  );
}