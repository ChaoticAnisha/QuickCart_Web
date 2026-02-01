import Link from "next/link"
import Image from "next/image"
import RegisterForm from "@/components/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-green-50 via-orange-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-green-200 rounded-2xl shadow-2xl p-8">
          {/* Header with Icon */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/hero-vegetables.svg"
                alt="Fresh Groceries"
                width={60}
                height={60}
              />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent mb-2">Join QuickCart</h1>
            <p className="text-gray-600">Create your account to start ordering</p>
          </div>

          {/* Register Form */}
          <RegisterForm />

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-bold hover:from-orange-600 hover:to-red-600 transition-all">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
