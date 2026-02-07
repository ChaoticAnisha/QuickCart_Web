'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '@/components/common/Button';
import { User as UserIcon, LogOut, MapPin, Phone, Mail, Edit, Camera } from 'lucide-react';
import { User } from '@/types';
import Image from 'next/image';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const authCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('quickcart_auth='));

    if (authCookie) {
      try {
        const authData = JSON.parse(decodeURIComponent(authCookie.split('=')[1]));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(authData.user);
      } catch (error) {
        console.error('Error parsing auth cookie:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    document.cookie = 'quickcart_auth=; path=/; max-age=0';
    router.push('/');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] p-6 text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
              <UserIcon className="w-12 h-12 text-[#FFA500]" />
            </div>
          )}
          <button
            onClick={() => router.push('/profile/edit')}
            className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Camera className="w-4 h-4 text-[#FFA500]" />
          </button>
        </div>
        <h1 className="text-2xl font-bold text-white">{user.name}</h1>
        <p className="text-white/80">{user.email}</p>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Profile Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-800">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold text-gray-800">{user.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-semibold text-gray-800">{user.address || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-3">
          <Button
            onClick={() => router.push('/profile/edit')}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <Edit className="w-5 h-5" />
            Edit Profile
          </Button>

          <Button
            onClick={() => router.push('/orders')}
            variant="outline"
            className="w-full"
          >
            My Orders
          </Button>
          
          <Button
            onClick={handleLogout}
            variant="danger"
            className="w-full flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}