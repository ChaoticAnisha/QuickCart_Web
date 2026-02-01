"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-gradient-to-r from-amber-50 to-orange-50 border-b-2 border-orange-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/images/logo.svg"
              alt="QuickCart Logo"
              width={40}
              height={40}
              className="group-hover:opacity-80 transition-opacity"
            />
            <span className="font-bold text-xl hidden sm:inline bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">QuickCart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              About
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Products
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Contact
            </Link>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              Log in
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all font-medium shadow-lg"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700 hover:text-orange-600 transition-colors">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-orange-200">
            <Link href="/" className="block py-2 text-gray-700 hover:text-orange-600 transition-colors">
              Home
            </Link>
            <Link href="/about" className="block py-2 text-gray-700 hover:text-orange-600 transition-colors">
              About
            </Link>
            <Link href="/products" className="block py-2 text-gray-700 hover:text-orange-600 transition-colors">
              Products
            </Link>
            <Link href="/contact" className="block py-2 text-gray-700 hover:text-orange-600 transition-colors">
              Contact
            </Link>
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-orange-200">
              <Link
                href="/login"
                className="text-center py-2 text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="text-center bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all font-medium shadow-lg"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
