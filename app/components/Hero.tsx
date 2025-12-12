import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <div 
      className="relative text-white"
      style={{
        backgroundImage: "url('/ecommerce-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#3B4B9C'
      }}
    >
      {/* White mesh grid pattern - visible in center, fades to edges */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.30) 2px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.30) 2px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          backgroundPosition: 'center center',
          maskImage: 'radial-gradient(circle at center, black 0%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 0%, black 40%, transparent 100%)'
        }}
      ></div>

      {/* Overlay for better text readability - Xent Blue (#3B4B9C) */}
      <div 
        className="absolute inset-0 bg-gradient-to-r" 
        style={{
          background: 'linear-gradient(to right, rgba(59, 75, 156, 0.85), rgba(59, 75, 156, 0.75))'
        }}
      ></div>
      
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
              className="bg-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              style={{ color: '#3B4B9C' }}
            >
              Shop Sustainable Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/about"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors hover:bg-white"
              style={{
                '--hover-color': '#3B4B9C'
              } as React.CSSProperties}
              onMouseEnter={(e) => e.currentTarget.style.color = '#3B4B9C'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
            >
              Learn About Our Mission
            </Link>
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">10+</div>
            <div className="text-blue-100 opacity-90">Sustainable Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">5+</div>
            <div className="text-blue-100 opacity-90">Local Artisans</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">100+</div>
            <div className="text-blue-100 opacity-90">Happy Customers</div>
          </div>
        </div>
      </div>
    </div>
  )
} 