import Link from "next/link"
import Image from "next/image"
import LoginForm from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-orange-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-blue-200 rounded-2xl shadow-2xl p-8">
          {/* Header with Icon */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/cart-icon.svg"
                alt="QuickCart"
                width={60}
                height={60}
              />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your QuickCart account</p>
          </div>

          {/* Login Form */}
          <LoginForm />

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-bold hover:from-orange-600 hover:to-red-600 transition-all">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
