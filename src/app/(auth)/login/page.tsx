'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { validateLoginForm, type LoginFormData } from '@/lib/validation';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form first
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    setServerError('');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check credentials and determine role
      let user = null;
      let role: 'admin' | 'client' | null = null;

      // Admin credentials
      if (formData.email === 'admin@quickcart.com' && formData.password === 'admin123') {
        user = {
          id: '2',
          name: 'Admin User',
          email: 'admin@quickcart.com',
          role: 'admin',
          address: 'Kathmandu, Nepal',
          phone: '+977 9851234567',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        role = 'admin';
      } 
      // Client credentials
      else if (formData.email === 'anisha@example.com' && formData.password === 'anisha123') {
        user = {
          id: '1',
          name: 'Anisha Sah',
          email: 'anisha@example.com',
          role: 'client',
          address: 'Kathmandu, Nepal',
          phone: '+977 9841234567',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        role = 'client';
      } 
      // Invalid credentials
      else {
        setServerError('Invalid email or password. Please try again.');
        setIsLoading(false);
        return;
      }

      // Set auth cookie
      const authData = {
        user,
        token: 'mock-token-' + Date.now(),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };

      document.cookie = `quickcart_auth=${JSON.stringify(authData)}; path=/; max-age=${7 * 24 * 60 * 60}`;

      // Navigate based on role
      if (role === 'admin') {
        console.log('✅ Admin login successful - Redirecting to /admin/dashboard');
        router.push('/admin/dashboard');
      } else if (role === 'client') {
        console.log('✅ Client login successful - Redirecting to /dashboard');
        router.push('/dashboard');
      }

    } catch (error) {
      console.error('Login error:', error);
      setServerError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (role: 'admin' | 'client') => {
    if (role === 'admin') {
      setFormData({ email: 'admin@quickcart.com', password: 'admin123' });
    } else {
      setFormData({ email: 'anisha@example.com', password: 'anisha123' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#FFD700] to-[#FFA500] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32">
              <Image src="/images/image 1 (1).png" alt="QuickCart Logo" fill className="object-contain" />
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white tracking-wide mb-2">Welcome Back</h1>
            <p className="text-white/70 text-base font-light">Sign in to continue shopping</p>
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="bg-red-500 text-white px-4 py-3 rounded-xl text-center font-semibold">
              {serverError}
            </div>
          )}

          {/* Demo Credentials */}
          <div className="bg-white/20 rounded-xl p-4">
            <p className="text-white text-sm font-semibold mb-3 text-center">📋 Demo Credentials - Click to Auto-fill:</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="w-full text-left text-white text-sm bg-white/10 hover:bg-white/30 px-4 py-3 rounded-lg transition-colors font-medium"
              >
                🔐 <strong>Admin:</strong> admin@quickcart.com / admin123
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('client')}
                className="w-full text-left text-white text-sm bg-white/10 hover:bg-white/30 px-4 py-3 rounded-lg transition-colors font-medium"
              >
                👤 <strong>Client:</strong> anisha@example.com / anisha123
              </button>
            </div>
          </div>

          {/* Email Field */}
          <div>
            <div className="bg-white rounded-xl shadow-lg">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full h-14 pl-12 pr-4 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 text-gray-800"
                  required
                />
              </div>
            </div>
            {errors.email && <p className="text-red-200 text-sm mt-2 ml-2">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <div className="bg-white rounded-xl shadow-lg">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full h-14 pl-12 pr-12 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 text-gray-800"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {errors.password && <p className="text-red-200 text-sm mt-2 ml-2">{errors.password}</p>}
          </div>

          {/* Login Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-white text-[#FFA500] rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center pt-2">
            <p className="text-white text-base">
              Dont have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/register')}
                className="font-bold underline decoration-2 hover:text-white/90 transition-colors"
              >
                Sign Up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}