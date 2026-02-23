'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Mail, Loader } from 'lucide-react';
import { requestPasswordReset } from '@/lib/api/password-reset.api';
import { toast } from 'react-toastify';

const RequestPasswordResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type RequestPasswordResetDTO = z.infer<typeof RequestPasswordResetSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<RequestPasswordResetDTO>({
    resolver: zodResolver(RequestPasswordResetSchema),
  });

  const onSubmit = async (data: RequestPasswordResetDTO) => {
    try {
      const response = await requestPasswordReset(data.email);
      
      if (response.success) {
        toast.success('Password reset link sent to your email! Check your inbox.');
      } else {
        toast.error(response.message || 'Failed to send reset email');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#FFD700] to-[#FFA500] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => router.push('/login')}
          className="flex items-center gap-2 text-white hover:text-white/80 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Login</span>
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <Image 
                src="/images/image 1 (1).png" 
                alt="QuickCart Logo" 
                fill 
                className="object-contain" 
              />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
            <p className="text-gray-600">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 transition-all"
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Remember your password?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-[#FFA500] font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}