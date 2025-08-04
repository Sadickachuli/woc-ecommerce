import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <div 
      className="relative bg-gradient-to-r from-primary-600/90 to-primary-800/90 text-white"
      style={{
        backgroundImage: "url('/ecommerce-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600/70 to-primary-800/70"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Sustainable Living
            <span className="block text-yellow-300">Made Simple</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Discover carefully curated eco-friendly products that help you live more sustainably 
            without compromising on quality, style, or convenience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              Shop Sustainable Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/about"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors"
            >
              Learn About Our Mission
            </Link>
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">100+</div>
            <div className="text-primary-200">Sustainable Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">50+</div>
            <div className="text-primary-200">Local Artisans</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">1000+</div>
            <div className="text-primary-200">Happy Customers</div>
          </div>
        </div>
      </div>
    </div>
  )
} 