"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { validateLoginForm, type LoginFormData } from "@/lib/validation";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { loginUser } from "@/lib/login";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    setServerError("");

    try {
      console.log('Login attempt:', formData);
      const result = await loginUser(formData);
      console.log('Login result:', result);
      
      if (result.success && result.user) {
        // ✅ Fixed: Check role from user object (already lowercase from login.ts)
        if (result.user.role === "admin") {
          console.log('Redirecting to admin dashboard');
          router.push("/admin/dashboard");
        } else {
          console.log('Redirecting to user dashboard');
          router.push("/dashboard");
        }
      } else {
        setServerError(result.error || "Invalid credentials");
      }
    } catch (error) {
      console.error('Login error:', error);
      setServerError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (type: "admin" | "user") => {
    if (type === "admin") {
      setFormData({ 
        email: "anishashah0117@gmail.com", 
        password: "your-admin-password" // ✅ Update with real password
      });
    } else {
      setFormData({ 
        email: "client@gmail.com", 
        password: "your-user-password" // ✅ Update with real password
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#FFD700] to-[#FFA500] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32">
              <Image 
                src="/images/image 1 (1).png" 
                alt="QuickCart Logo" 
                fill 
                className="object-contain" 
              />
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white tracking-wide mb-2">
              Welcome Back
            </h1>
            <p className="text-white/70 text-base font-light">
              Sign in to continue shopping
            </p>
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="bg-red-500 text-white px-4 py-3 rounded-xl text-center font-semibold">
              {serverError}
            </div>
          )}

          {/* Demo Credentials */}
          <div className="bg-white/20 rounded-xl p-4">
            <p className="text-white text-sm font-semibold mb-3 text-center">
              📋 Demo Credentials - Click to Auto-fill:
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials("admin")}
                className="w-full text-left text-white text-sm bg-white/10 hover:bg-white/30 px-4 py-3 rounded-lg transition-colors font-medium"
              >
                🔐 <strong>Admin:</strong> anishashah0117@gmail.com
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials("user")}
                className="w-full text-left text-white text-sm bg-white/10 hover:bg-white/30 px-4 py-3 rounded-lg transition-colors font-medium"
              >
                👤 <strong>User:</strong> client@gmail.com
              </button>
            </div>
          </div>

          {/* Email Field */}
          <div>
            <div className="bg-white rounded-xl shadow-lg">
              <div className="relative">
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
            {errors.email && (
              <p className="text-red-200 text-sm mt-2 ml-2">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="bg-white rounded-xl shadow-lg">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
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
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
            {errors.password && (
              <p className="text-red-200 text-sm mt-2 ml-2">{errors.password}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-white text-sm font-medium hover:underline"
            >
              Forgot Password?
            </button>
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
                "Login"
              )}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center pt-2">
            <p className="text-white text-base">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/register")}
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