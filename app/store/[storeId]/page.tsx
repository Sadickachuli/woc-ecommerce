'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Store as StoreIcon, Mail, ExternalLink, Package } from 'lucide-react'
import { getStore, getProductsByStore, Store, Product } from '@/lib/firebase/firestore'
import ProductGrid from '@/app/components/ProductGrid'
import Link from 'next/link'

export default function StorePage() {
  const params = useParams()
  const storeId = params.storeId as string
  
  const [store, setStore] = useState<Store | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStoreData = async () => {
      setLoading(true)
      try {
        const [storeData, storeProducts] = await Promise.all([
          getStore(storeId),
          getProductsByStore(storeId)
        ])
        
        setStore(storeData)
        setProducts(storeProducts)
      } catch (error) {
        console.error('Error loading store data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (storeId) {
      loadStoreData()
    }
  }, [storeId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading store...</p>
        </div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <StoreIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h1>
          <p className="text-gray-600 mb-6">The store you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    )
  }

  if (store.status !== 'verified') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <StoreIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Store Not Available</h1>
          <p className="text-gray-600 mb-6">This store is currently under review and not available for browsing.</p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Browse Other Products
          </Link>
        </div>
      </div>
    )
  }

  const primaryColor = store.branding?.primaryColor || '#3b82f6'
  const accentColor = store.branding?.accentColor || '#8b5cf6'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Banner */}
      {store.branding?.banner && (
        <div className="w-full h-64 overflow-hidden">
          <img
            src={store.branding.banner}
            alt={`${store.storeName} banner`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Store Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                {store.branding?.logo ? (
                  <img
                    src={store.branding.logo}
                    alt={`${store.storeName} logo`}
                    className="w-20 h-20 rounded-lg object-contain border-2 shadow-sm"
                    style={{ borderColor: primaryColor }}
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-lg flex items-center justify-center text-white text-2xl font-bold"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {store.storeName.charAt(0)}
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{store.storeName}</h1>
                  {store.branding?.tagline && (
                    <p className="text-lg text-gray-600 mt-1">{store.branding.tagline}</p>
                  )}
                  <span
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold mt-2"
                    style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                  >
                    ✓ Verified Seller
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{store.contactEmail}</span>
                </div>
                
                {store.applicationDetails.socialMediaLinks && (
                  <div className="flex items-start text-gray-600">
                    <ExternalLink className="w-4 h-4 mr-2 mt-1" />
                    <div className="whitespace-pre-wrap text-sm">
                      {store.applicationDetails.socialMediaLinks}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Store Description */}
          {(store.branding?.description || store.applicationDetails.productInfo) && (
            <div className="mt-6 bg-gray-50 rounded-lg p-6 border-l-4" style={{ borderColor: primaryColor }}>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">About This Store</h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {store.branding?.description || store.applicationDetails.productInfo}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Store Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="w-6 h-6 text-gray-600" />
              <h2 className="text-2xl font-bold text-gray-900">Products</h2>
            </div>
            <p className="text-gray-600">
              {products.length} {products.length === 1 ? 'product' : 'products'}
            </p>
          </div>
        </div>

        {products.length > 0 ? (
          <ProductGrid products={products} stores={store ? [store] : []} />
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Yet</h3>
            <p className="text-gray-600">This store hasn't added any products yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}


