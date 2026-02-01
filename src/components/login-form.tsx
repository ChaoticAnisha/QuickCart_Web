"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirect to dashboard
    window.location.href = "/auth/dashboard"
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border-2 border-blue-200 bg-blue-50 text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          required
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-semibold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent mb-2">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border-2 border-blue-200 bg-blue-50 text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Remember me & Forgot password */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-2 border-blue-300 accent-blue-600" />
          <span className="text-gray-600">Remember me</span>
        </label>
        <Link href="#" className="text-orange-600 hover:text-orange-700 transition-colors font-semibold">
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-orange-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-orange-700 transition-all font-semibold mt-6 shadow-lg hover:shadow-xl"
      >
        Sign In
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="text-sm text-gray-500">Or continue with</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Social Login */}
      <button
        type="button"
        className="w-full border-2 border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-foreground hover:border-orange-400"
      >
        Continue with Google
      </button>
    </form>
  )
}
