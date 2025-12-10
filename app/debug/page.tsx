'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

export default function DebugPage() {
  const [stores, setStores] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all stores
        const storesSnapshot = await getDocs(collection(db, 'stores'))
        const storesData = storesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setStores(storesData)

        // Load all products
        const productsSnapshot = await getDocs(collection(db, 'products'))
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setProducts(productsData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading debug info...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Debug Info</h1>

        {/* Stores Section */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Stores ({stores.length})</h2>
          {stores.length === 0 ? (
            <p className="text-red-600">No stores found!</p>
          ) : (
            <div className="space-y-4">
              {stores.map((store) => (
                <div key={store.id} className="border rounded p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">Document ID:</p>
                      <p className="font-mono text-sm bg-yellow-100 p-2 rounded">
                        {store.id}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Status:</p>
                      <p className={store.status === 'verified' ? 'text-green-600' : 'text-yellow-600'}>
                        {store.status}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Store Name:</p>
                      <p>{store.storeName}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Owner UID:</p>
                      <p className="font-mono text-xs">{store.ownerUid}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Products ({products.length})</h2>
          {products.length === 0 ? (
            <p className="text-red-600">No products found!</p>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="border rounded p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">Product Name:</p>
                      <p>{product.name}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Price:</p>
                      <p>${product.price}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-semibold">Store ID:</p>
                      <p className="font-mono text-sm bg-blue-100 p-2 rounded">
                        {product.storeId || <span className="text-red-600">MISSING!</span>}
                      </p>
                    </div>
                    {/* Check if storeId matches any store */}
                    <div className="col-span-2">
                      <p className="font-semibold">Store Match:</p>
                      {product.storeId ? (
                        stores.find(s => s.id === product.storeId) ? (
                          <p className="text-green-600">
                            ✓ Matches store: {stores.find(s => s.id === product.storeId)?.storeName}
                          </p>
                        ) : (
                          <p className="text-red-600">
                            ✗ No matching store found for storeId: {product.storeId}
                          </p>
                        )
                      ) : (
                        <p className="text-red-600">✗ Product has no storeId!</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Summary</h3>
          <ul className="space-y-2">
            <li>
              <strong>Total Stores:</strong> {stores.length} ({stores.filter(s => s.status === 'verified').length} verified)
            </li>
            <li>
              <strong>Total Products:</strong> {products.length}
            </li>
            <li>
              <strong>Products with storeId:</strong>{' '}
              {products.filter(p => p.storeId).length} / {products.length}
            </li>
            <li>
              <strong>Products matching verified stores:</strong>{' '}
              {products.filter(p => 
                stores.find(s => s.id === p.storeId && s.status === 'verified')
              ).length} / {products.length}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}


