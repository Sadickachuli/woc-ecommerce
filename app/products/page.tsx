'use client'

import { useState, useEffect } from 'react'
import ProductGrid from '../components/ProductGrid'
import { Search, Filter } from 'lucide-react'
import { Product } from '../types'
import { getProducts, subscribeToProductUpdates } from '../lib/data'

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentProducts, setCurrentProducts] = useState<Product[]>([])


  // Load products from data store and subscribe to updates
  useEffect(() => {
    const loadProducts = () => {
      // Get the current products from the data store
      const products = getProducts()
      setCurrentProducts(products)
    }
    
    // Load products initially
    loadProducts()
    
    // Subscribe to product updates
    const unsubscribe = subscribeToProductUpdates(() => {
      console.log('Product update detected, reloading products...')
      loadProducts()
    })

    // Listen for localStorage changes (for cross-tab sync) - only in browser
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ecommerce_products') {
        console.log('localStorage change detected, reloading products...')
        loadProducts()
      }
    }

    // Add storage event listener only in browser
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange)
    }
    
    // Also poll every 2 seconds as a backup
    const interval = setInterval(loadProducts, 2000)
    
    // Cleanup subscription and listeners on unmount
    return () => {
      unsubscribe()
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange)
      }
      clearInterval(interval)
    }
  }, [])



  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'stationery', name: 'Stationery' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'home', name: 'Home & Garden' },
    { id: 'beauty', name: 'Beauty' },
    { id: 'food', name: 'Food' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'Technology', name: 'Technology' },
    { id: 'Fashion', name: 'Fashion' },
    { id: 'Jewelry', name: 'Jewelry' }
  ]

  const filteredProducts = currentProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">Discover sustainable and eco-friendly products that make a difference.</p>

        </div>



        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {currentProducts.length} products
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
} 