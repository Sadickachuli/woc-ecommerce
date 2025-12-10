'use client'

import { useState, useEffect } from 'react'
import ProductGrid from '../components/ProductGrid'
import { Search, Store } from 'lucide-react'
import { Product } from '../types'
import { getProducts, subscribeToProductUpdates } from '../lib/data'
import { Store as StoreType } from '@/lib/firebase/firestore'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import Link from 'next/link'

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStore, setSelectedStore] = useState('all')
  const [currentProducts, setCurrentProducts] = useState<Product[]>([])
  const [stores, setStores] = useState<StoreType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load stores and products
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Load verified stores
        const storesQuery = query(
          collection(db, 'stores'),
          where('status', '==', 'verified')
        )
        const storesSnapshot = await getDocs(storesQuery)
        const verifiedStores = storesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as StoreType))
        setStores(verifiedStores)

        // Load products from API
        const response = await fetch('/api/products')
        if (response.ok) {
          const products = await response.json()
          setCurrentProducts(products)
        } else {
          // Fallback to local data store
          const products = await getProducts()
          setCurrentProducts(products)
        }
      } catch (error) {
        console.error('Error loading data:', error)
        try {
          // Fallback to local data store
          const products = await getProducts()
          setCurrentProducts(products)
        } catch (dbError) {
          console.error('Error loading products from database:', dbError)
          setCurrentProducts([])
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    // Load data initially
    loadData()
    
    // Subscribe to product updates for real-time sync
    const unsubscribe = subscribeToProductUpdates(() => {
      console.log('Product update detected, reloading products...')
      loadData()
    })

    // Listen for localStorage changes (for cross-tab sync) - only in browser
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ecommerce_products') {
        console.log('localStorage change detected, reloading products...')
        loadData()
      }
    }

    // Add storage event listener only in browser
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange)
    }
    
    // Cleanup subscription and listeners on unmount
    return () => {
      unsubscribe()
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange)
      }
    }
  }, [])

  const filteredProducts = currentProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStore = selectedStore === 'all' || product.storeId === selectedStore
    return matchesSearch && matchesStore
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Stores & Products</h1>
          <p className="text-gray-600">Shop from verified sellers in our marketplace.</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stores Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Store className="w-5 h-5 mr-2" />
            Shop by Store
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {/* All Stores */}
            <button
              onClick={() => setSelectedStore('all')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedStore === 'all'
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white hover:border-primary-300'
              }`}
            >
              <div className="text-center">
                <Store className="w-6 h-6 mx-auto mb-1" />
                <p className="text-sm font-medium">All Stores</p>
                <p className="text-xs text-gray-500 mt-1">
                  {currentProducts.length} products
                </p>
              </div>
            </button>

            {/* Individual Stores */}
            {stores.map((store) => {
              const storeProductCount = currentProducts.filter(p => p.storeId === store.id).length
              const primaryColor = store.branding?.primaryColor || '#3b82f6'
              
              return (
                <button
                  key={store.id}
                  onClick={() => setSelectedStore(store.id!)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedStore === store.id
                      ? 'bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                  style={selectedStore === store.id ? { borderColor: primaryColor } : {}}
                >
                  <div className="text-center">
                    {store.branding?.logo ? (
                      <img
                        src={store.branding.logo}
                        alt={store.storeName}
                        className="w-12 h-12 rounded-full mx-auto mb-2 object-contain border"
                        style={{ borderColor: primaryColor }}
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {store.storeName.charAt(0)}
                      </div>
                    )}
                    <p className="text-sm font-medium truncate">{store.storeName}</p>
                    {store.branding?.tagline && (
                      <p className="text-xs text-gray-500 truncate">{store.branding.tagline}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {storeProductCount} {storeProductCount === 1 ? 'product' : 'products'}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* View Store Page Link */}
          {selectedStore !== 'all' && (
            <div className="mt-4">
              <Link
                href={`/store/${selectedStore}`}
                className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                <Store className="w-4 h-4 mr-1" />
                View full store page →
              </Link>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {isLoading ? (
              "Loading products..."
            ) : (
              <>
                Showing {filteredProducts.length} of {currentProducts.length} products
                {selectedStore !== 'all' && stores.find(s => s.id === selectedStore) && (
                  <span className="ml-2 text-primary-600 font-medium">
                    from {stores.find(s => s.id === selectedStore)?.storeName}
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading products...</h3>
            <p className="text-gray-600">Please wait while we fetch the latest products.</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} stores={stores} />
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? 'Try adjusting your search.'
                : selectedStore !== 'all'
                ? 'This store hasn\'t added products yet.'
                : 'No stores have added products yet.'}
            </p>
            {selectedStore !== 'all' && (
              <button
                onClick={() => setSelectedStore('all')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View all stores
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
