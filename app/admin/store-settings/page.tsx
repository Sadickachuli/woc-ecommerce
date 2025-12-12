'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Store, Palette, Image as ImageIcon, Save, Eye, DollarSign, Truck } from 'lucide-react'
import { getCurrentUser, onAuthChange } from '@/lib/firebase/auth'
import { getUser, getStoreByOwner, updateStoreBranding } from '@/lib/firebase/firestore'
import { Store as StoreType } from '@/lib/firebase/firestore'
import { User as FirebaseUser } from 'firebase/auth'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { CURRENCIES, DEFAULT_CURRENCY } from '@/lib/currencies'

export default function StoreSettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [store, setStore] = useState<StoreType | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [branding, setBranding] = useState({
    logo: '',
    banner: '',
    primaryColor: '#3b82f6',
    accentColor: '#8b5cf6',
    description: '',
    tagline: '',
    currency: DEFAULT_CURRENCY
  })

  const [shipping, setShipping] = useState<{
    type: 'free' | 'flat_rate' | 'contact_seller'
    cost: number
  }>({
    type: 'free',
    cost: 0
  })

  useEffect(() => {
    const unsubscribe = onAuthChange(async (currentUser) => {
      setUser(currentUser)
      
      if (currentUser) {
        const userData = await getUser(currentUser.uid)
        
        if (userData) {
          setUserRole(userData.role)
          
          if (userData.role === 'seller') {
            const sellerStore = await getStoreByOwner(currentUser.uid)
            setStore(sellerStore)
            
            // Load existing branding if available
            if (sellerStore?.branding) {
              setBranding({
                logo: sellerStore.branding.logo || '',
                banner: sellerStore.branding.banner || '',
                primaryColor: sellerStore.branding.primaryColor || '#3b82f6',
                accentColor: sellerStore.branding.accentColor || '#8b5cf6',
                description: sellerStore.branding.description || '',
                tagline: sellerStore.branding.tagline || '',
                currency: sellerStore.currency || DEFAULT_CURRENCY
              })
            } else if (sellerStore) {
              // Load currency even if no branding yet
              setBranding(prev => ({
                ...prev,
                currency: sellerStore.currency || DEFAULT_CURRENCY
              }))
            }

            // Load shipping settings if available
            if (sellerStore?.shipping) {
              setShipping({
                type: sellerStore.shipping.type,
                cost: sellerStore.shipping.cost || 0
              })
            }
          }
        }
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleSave = async () => {
    if (!store) {
      toast.error('Store not found')
      return
    }

    setSaving(true)

    try {
      // Separate currency from branding
      const { currency, ...brandingData } = branding
      
      // Save branding, currency, and shipping at store level
      await updateStoreBranding(store.id!, {
        branding: brandingData,
        currency: currency,
        shipping: shipping
      })
      toast.success('Store settings updated successfully!')
    } catch (error) {
      console.error('Error updating store settings:', error)
      toast.error('Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || userRole !== 'seller' || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You must be a verified seller to access store settings.</p>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Store Branding</h1>
              <p className="text-gray-600">Customize your store's appearance and branding</p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href={`/store/${store.id}`}
                target="_blank"
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Store</span>
              </Link>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Store Currency */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Store Currency</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select your store's currency
              </label>
              <select
                value={branding.currency}
                onChange={(e) => setBranding({ ...branding, currency: e.target.value })}
                className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-500">
                All product prices in your store will be displayed in this currency.
              </p>
            </div>
          </div>

          {/* Shipping Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Truck className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Shipping Settings</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How do you handle shipping?
                </label>
                <div className="space-y-3">
                  {/* Free Shipping */}
                  <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{ borderColor: shipping.type === 'free' ? '#3b82f6' : '#e5e7eb' }}>
                    <input
                      type="radio"
                      name="shippingType"
                      value="free"
                      checked={shipping.type === 'free'}
                      onChange={(e) => setShipping({ ...shipping, type: e.target.value as 'free' | 'flat_rate' | 'contact_seller' })}
                      className="mt-1 w-4 h-4 text-blue-600"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">Free Shipping</div>
                      <div className="text-sm text-gray-500">
                        You offer free shipping on all orders
                      </div>
                    </div>
                  </label>

                  {/* Flat Rate */}
                  <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{ borderColor: shipping.type === 'flat_rate' ? '#3b82f6' : '#e5e7eb' }}>
                    <input
                      type="radio"
                      name="shippingType"
                      value="flat_rate"
                      checked={shipping.type === 'flat_rate'}
                      onChange={(e) => setShipping({ ...shipping, type: e.target.value as 'free' | 'flat_rate' | 'contact_seller' })}
                      className="mt-1 w-4 h-4 text-blue-600"
                    />
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-gray-900">Flat Rate Shipping</div>
                      <div className="text-sm text-gray-500 mb-3">
                        Charge a fixed shipping cost for all orders
                      </div>
                      {shipping.type === 'flat_rate' && (
                        <div className="mt-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Shipping Cost
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">{CURRENCIES.find(c => c.code === branding.currency)?.symbol || '$'}</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={shipping.cost}
                              onChange={(e) => setShipping({ ...shipping, cost: parseFloat(e.target.value) || 0 })}
                              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Contact Seller */}
                  <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{ borderColor: shipping.type === 'contact_seller' ? '#3b82f6' : '#e5e7eb' }}>
                    <input
                      type="radio"
                      name="shippingType"
                      value="contact_seller"
                      checked={shipping.type === 'contact_seller'}
                      onChange={(e) => setShipping({ ...shipping, type: e.target.value as 'free' | 'flat_rate' | 'contact_seller' })}
                      className="mt-1 w-4 h-4 text-blue-600"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">Contact for Shipping Cost</div>
                      <div className="text-sm text-gray-500">
                        Shipping cost varies by location. You'll discuss it with buyers directly after they place an order.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Buyers will see your shipping policy at checkout. If you choose "Contact for Shipping Cost", 
                  buyers will complete their order and you'll contact them to arrange shipping and finalize the total cost.
                </p>
              </div>
            </div>
          </div>

          {/* Store Images */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-4">
              <ImageIcon className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Store Images</h2>
            </div>

            <div className="space-y-4">
              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Logo
                </label>
                <input
                  type="url"
                  value={branding.logo}
                  onChange={(e) => setBranding({ ...branding, logo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {branding.logo && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <img
                      src={branding.logo}
                      alt="Store logo"
                      className="w-32 h-32 object-contain border rounded-lg bg-gray-50"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EInvalid%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  </div>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Recommended: Square image, 200x200px or larger. Use a free service like{' '}
                  <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Imgur
                  </a>{' '}
                  to host images.
                </p>
              </div>

              {/* Banner */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Banner
                </label>
                <input
                  type="url"
                  value={branding.banner}
                  onChange={(e) => setBranding({ ...branding, banner: e.target.value })}
                  placeholder="https://example.com/banner.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {branding.banner && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <img
                      src={branding.banner}
                      alt="Store banner"
                      className="w-full h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EInvalid%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  </div>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Recommended: Wide image, 1200x300px or similar aspect ratio
                </p>
              </div>
            </div>
          </div>

          {/* Store Colors */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Palette className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Store Colors</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={branding.primaryColor}
                    onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                    className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={branding.primaryColor}
                    onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                    placeholder="#3b82f6"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Used for buttons, links, and primary elements
                </p>
              </div>

              {/* Accent Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accent Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={branding.accentColor}
                    onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                    className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={branding.accentColor}
                    onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                    placeholder="#8b5cf6"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Used for highlights and secondary elements
                </p>
              </div>
            </div>

            {/* Color Preview */}
            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <p className="text-sm font-medium text-gray-700 mb-3">Color Preview:</p>
              <div className="flex items-center space-x-3">
                <button
                  style={{ backgroundColor: branding.primaryColor }}
                  className="px-4 py-2 text-white rounded-lg font-medium"
                >
                  Primary Button
                </button>
                <button
                  style={{ backgroundColor: branding.accentColor }}
                  className="px-4 py-2 text-white rounded-lg font-medium"
                >
                  Accent Button
                </button>
              </div>
            </div>
          </div>

          {/* Store Text */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Store className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Store Information</h2>
            </div>

            <div className="space-y-4">
              {/* Tagline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  value={branding.tagline}
                  onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
                  placeholder="Your catchy store tagline..."
                  maxLength={60}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">
                  {branding.tagline.length}/60 characters - A short, memorable phrase
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Description
                </label>
                <textarea
                  value={branding.description}
                  onChange={(e) => setBranding({ ...branding, description: e.target.value })}
                  placeholder="Tell customers about your store, your products, and what makes you unique..."
                  rows={5}
                  maxLength={500}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">
                  {branding.description.length}/500 characters
                </p>
              </div>
            </div>
          </div>

          {/* Save Button (Bottom) */}
          <div className="flex items-center justify-between bg-white rounded-lg shadow p-6">
            <Link
              href="/admin/dashboard"
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 font-medium"
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

