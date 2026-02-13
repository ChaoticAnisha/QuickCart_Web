"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { validateRegisterForm, type RegisterFormData } from "@/lib/validation";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { registerUser } from "@/lib/register";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "Kathmandu, Nepal",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    setServerError("");

    try {
      const { confirmPassword, ...registerData } = formData;
      const result = await registerUser(registerData);

      if (result.success) {
        router.push("/dashboard");
      } else {
        setServerError(result.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#FFD700] to-[#FFA500] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative w-28 h-28">
              <Image src="/images/image 1 (1).png" alt="QuickCart Logo" fill className="object-contain" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white tracking-wide mb-2">Create Account</h1>
            <p className="text-white/70 text-base font-light">Sign up to start shopping</p>
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="bg-red-500 text-white px-4 py-3 rounded-xl text-center font-semibold">
              {serverError}
            </div>
          )}

          {/* Name Field */}
          <div>
            <div className="bg-white rounded-xl shadow-lg">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full h-14 pl-12 pr-4 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 text-gray-800"
                />
              </div>
            </div>
            {errors.name && <p className="text-red-200 text-sm mt-2 ml-2">{errors.name}</p>}
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
                />
              </div>
            </div>
            {errors.email && <p className="text-red-200 text-sm mt-2 ml-2">{errors.email}</p>}
          </div>

          {/* Phone Field */}
          <div>
            <div className="bg-white rounded-xl shadow-lg">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+977 9841234567 (optional)"
                  className="w-full h-14 pl-12 pr-4 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 text-gray-800"
                />
              </div>
            </div>
            {errors.phone && <p className="text-red-200 text-sm mt-2 ml-2">{errors.phone}</p>}
          </div>

          {/* Address Field */}
          <div>
            <div className="bg-white rounded-xl shadow-lg">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <select
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full h-14 pl-12 pr-4 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 text-gray-800 bg-white"
                >
                  <option value="Kathmandu, Nepal">Kathmandu, Nepal</option>
                  <option value="Pokhara, Nepal">Pokhara, Nepal</option>
                  <option value="Lalitpur, Nepal">Lalitpur, Nepal</option>
                  <option value="Bhaktapur, Nepal">Bhaktapur, Nepal</option>
                  <option value="Biratnagar, Nepal">Biratnagar, Nepal</option>
                </select>
              </div>
            </div>
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
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full h-14 pl-12 pr-12 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
            {errors.password && <p className="text-red-200 text-sm mt-2 ml-2">{errors.password}</p>}
          </div>

          {/* Confirm Password Field */}
          <div>
            <div className="bg-white rounded-xl shadow-lg">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full h-14 pl-12 pr-12 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#FFA500]/50 text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
            {errors.confirmPassword && <p className="text-red-200 text-sm mt-2 ml-2">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-white text-[#FFA500] rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  Creating Account...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center pt-2">
            <p className="text-white text-base">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="font-bold underline decoration-2 hover:text-white/90 transition-colors"
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}