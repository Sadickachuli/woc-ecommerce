'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingCart, User, LogIn, UserPlus } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { onAuthChange, signOut } from '@/lib/firebase/auth'
import { User as FirebaseUser } from 'firebase/auth'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const pathname = usePathname()
  const { state } = useCart()

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (typeof document === 'undefined') return
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      // Check if click is outside the entire header element
      if (!target.closest('header')) {
        setIsMenuOpen(false)
      }
    }

    // Only add listener when menu is open
    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside)
    }
    
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMenuOpen])

  const handleNavigation = (path: string) => {
    console.log('Navigating to:', path)
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3" onClick={() => handleNavigation('/')}>
            <img 
              src="/xent-logo.png" 
              alt="Xent Logo" 
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold text-gray-900"></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`transition-colors ${
                pathname === '/'
                  ? 'text-primary-600 font-medium'
                  : 'text-gray-700 hover:text-primary-600'
              }`}
              onClick={() => handleNavigation('/')}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`transition-colors ${
                pathname === '/products'
                  ? 'text-primary-600 font-medium'
                  : 'text-gray-700 hover:text-primary-600'
              }`}
              onClick={() => handleNavigation('/products')}
            >
              Products
            </Link>
            <Link
              href="/about"
              className={`transition-colors ${
                pathname === '/about'
                  ? 'text-primary-600 font-medium'
                  : 'text-gray-700 hover:text-primary-600'
              }`}
              onClick={() => handleNavigation('/about')}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`transition-colors ${
                pathname === '/contact'
                  ? 'text-primary-600 font-medium'
                  : 'text-gray-700 hover:text-primary-600'
              }`}
              onClick={() => handleNavigation('/contact')}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Icon */}
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-primary-600 transition-colors" />
              {state.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {state.items.length}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 hidden lg:inline">
                  {user.displayName || user.email}
                </span>
                <Link
                  href="/admin/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
                <button
                  onClick={async () => {
                    await signOut()
                    window.location.href = '/'
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/admin"
                  className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title="For existing Admins & Sellers"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/become-seller"
                  className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                  title="Apply for a new store"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sell on Platform</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center space-x-4">
            {/* Cart Icon */}
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-primary-600 transition-colors" />
              {state.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {state.items.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('Hamburger clicked, current state:', isMenuOpen)
                setIsMenuOpen(!isMenuOpen)
              }}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors touch-manipulation"
              aria-label="Toggle mobile menu"
              type="button"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 py-4 bg-white">
            <div className="flex flex-col space-y-1">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-base font-medium ${
                  pathname === '/'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
                onClick={() => handleNavigation('/')}
              >
                Home
              </Link>
              <Link
                href="/products"
                className={`px-3 py-2 rounded-md text-base font-medium ${
                  pathname === '/products'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
                onClick={() => handleNavigation('/products')}
              >
                Products
              </Link>
              <Link
                href="/about"
                className={`px-3 py-2 rounded-md text-base font-medium ${
                  pathname === '/about'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
                onClick={() => handleNavigation('/about')}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`px-3 py-2 rounded-md text-base font-medium ${
                  pathname === '/contact'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
                onClick={() => handleNavigation('/contact')}
              >
                Contact
              </Link>
              <Link
                href="/cart"
                className={`px-3 py-2 rounded-md text-base font-medium ${
                  pathname === '/cart'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
                onClick={() => handleNavigation('/cart')}
              >
                Cart ({state.items.length})
              </Link>

              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                {user ? (
                  <>
                    <Link
                      href="/admin"
                      className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 flex items-center space-x-2"
                      onClick={() => handleNavigation('/admin')}
                    >
                      <User className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={async () => {
                        await signOut()
                        window.location.href = '/'
                      }}
                      className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/admin"
                      className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 flex items-center space-x-2"
                      onClick={() => handleNavigation('/admin')}
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/become-seller"
                      className="px-3 py-2 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700 flex items-center space-x-2 mt-2"
                      onClick={() => handleNavigation('/become-seller')}
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Become a Seller</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
} 