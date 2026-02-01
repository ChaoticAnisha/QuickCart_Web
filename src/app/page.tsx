import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Leaf, Zap, Shield, Truck } from "lucide-react"

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/images/banner.svg"
            alt="Decorative vegetables"
            fill
            className="object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-6 text-balance">
                Fresh Groceries Delivered Fast
              </h1>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed font-medium">
                Get fresh, quality groceries delivered to your door within 30 minutes. Premium selection, competitive
                prices, and exceptional service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Get Started <ArrowRight size={20} />
                </Link>
                <Link
                  href="/login"
                  className="border-2 border-orange-400 text-orange-600 px-8 py-3 rounded-lg hover:bg-orange-50 transition-all font-semibold"
                >
                  Already have an account?
                </Link>
              </div>
            </div>
            {/* Banner Image */}
            <div className="rounded-2xl h-96 flex items-center justify-center overflow-hidden shadow-xl">
              <Image
                src="/images/banner.svg"
                alt="Fresh groceries"
                width={600}
                height={400}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">Why Choose QuickCart?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="p-6 border border-orange-200 rounded-xl hover:shadow-lg hover:border-orange-400 transition-all hover:bg-orange-50/50">
              <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4">
                <Zap className="text-orange-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">30-Minute Delivery</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get your groceries delivered within 30 minutes. Fast and reliable service guaranteed.
              </p>
            </div>
            <div className="p-6 border border-green-200 rounded-xl hover:shadow-lg hover:border-green-400 transition-all hover:bg-green-50/50">
              <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
                <Leaf className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Fresh Quality</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sourced from premium local suppliers. We guarantee freshness on every item.
              </p>
            </div>
            <div className="p-6 border border-blue-200 rounded-xl hover:shadow-lg hover:border-blue-400 transition-all hover:bg-blue-50/50">
              <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                <Shield className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Secure Checkout</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your payment and personal information are protected with industry-standard encryption.
              </p>
            </div>
            <div className="p-6 border border-purple-200 rounded-xl hover:shadow-lg hover:border-purple-400 transition-all hover:bg-purple-50/50">
              <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
                <Truck className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Track Orders</h3>
              <p className="text-muted-foreground leading-relaxed">
                Real-time tracking of your delivery. Know exactly when your groceries arrive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-amber-400 via-orange-500 to-orange-600 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Ordering?</h2>
          <p className="text-lg mb-8 opacity-95">
            Join thousands of customers who trust QuickCart for their daily grocery needs.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg hover:bg-amber-50 transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>
    </main>
  )
}
