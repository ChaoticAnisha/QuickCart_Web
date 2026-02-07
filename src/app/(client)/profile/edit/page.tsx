'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { ArrowLeft, Camera, User as UserIcon } from 'lucide-react';
import { User } from '@/types';
import Image from 'next/image';

export default function EditProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
  });

  useEffect(() => {
    const authCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('quickcart_auth='));

    if (authCookie) {
      try {
        const authData = JSON.parse(decodeURIComponent(authCookie.split('=')[1]));
        const user: User = authData.user;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          avatar: user.avatar || '',
        });
        if (user.avatar) {
          setAvatarPreview(user.avatar);
        }
      } catch (error) {
        console.error('Error parsing auth cookie:', error);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setFormData(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update cookie with new data
      const authCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('quickcart_auth='));

      if (authCookie) {
        const authData = JSON.parse(decodeURIComponent(authCookie.split('=')[1]));
        authData.user = { ...authData.user, ...formData };
        document.cookie = `quickcart_auth=${JSON.stringify(authData)}; path=/; max-age=${7 * 24 * 60 * 60}`;
      }

      router.push('/profile');
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] p-4 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <p className="text-sm text-gray-600">Click camera icon to upload photo</p>
          </div>

          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            disabled
          />

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+977 9841234567"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <select
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full h-14 px-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 focus:border-[#FFA500]"
            >
              <option value="Kathmandu, Nepal">Kathmandu, Nepal</option>
              <option value="Pokhara, Nepal">Pokhara, Nepal</option>
              <option value="Lalitpur, Nepal">Lalitpur, Nepal</option>
              <option value="Bhaktapur, Nepal">Bhaktapur, Nepal</option>
              <option value="Biratnagar, Nepal">Biratnagar, Nepal</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" isLoading={isLoading} className="flex-1">
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}