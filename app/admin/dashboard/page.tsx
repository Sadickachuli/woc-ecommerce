'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  LogOut,
  Eye,
  X,
  Save,
  Upload,
  CheckCircle,
  Clock,
  Palette,
  UserCog
} from 'lucide-react'
import { getCurrentUser, onAuthChange, signInWithGoogle, signOut } from '@/lib/firebase/auth'
import { 
  getUser, 
  getStore, 
  getStoreByOwner,
  getPendingStores,
  getProductsByStore,
  getProductsFromVerifiedStores,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  getAllStores,
  Store,
  Product,
  Order
} from '@/lib/firebase/firestore'
import { formatPrice } from '@/lib/currencies'
import { User as FirebaseUser } from 'firebase/auth'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userRole, setUserRole] = useState<'admin' | 'seller' | 'user' | null>(null)
  const [userStore, setUserStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'sellers'>('overview')
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [pendingStores, setPendingStores] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [allStores, setAllStores] = useState<Store[]>([]) // For currency lookup

  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: ''
  })

  // Auth check
  useEffect(() => {
    const unsubscribe = onAuthChange(async (currentUser) => {
      setUser(currentUser)
      
      if (currentUser) {
        // Check user role in Firestore
        const userData = await getUser(currentUser.uid)
        
        if (userData) {
          setUserRole(userData.role)
          
          // If seller, get their store
          if (userData.role === 'seller' && userData.storeId) {
            const store = await getStore(userData.storeId)
            setUserStore(store)
          } else if (userData.role === 'seller' && !userData.storeId) {
            // Seller without storeId, check by owner
            const store = await getStoreByOwner(currentUser.uid)
            setUserStore(store)
          }
      } else {
          // Default to user role if not found
          setUserRole('user')
        }
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Load data based on role
  useEffect(() => {
    if (!user || !userRole) return

    const loadData = async () => {
      if (userRole === 'admin') {
        // Load all data for admin
        const [allOrders, allProducts, pending, stores] = await Promise.all([
          getAllOrders(),
          getProductsFromVerifiedStores(),
          getPendingStores(),
          getAllStores()
        ])
        setOrders(allOrders)
        setProducts(allProducts)
        setPendingStores(pending)
        setAllStores(stores)
      } else if (userRole === 'seller' && userStore) {
        // Load seller's products
        const storeProducts = await getProductsByStore(userStore.id!)
        setProducts(storeProducts)
      }
    }

    loadData()
  }, [user, userRole, userStore])

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
      toast.success('Signed in successfully!')
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error('Failed to sign in')
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to log out')
    }
  }

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      image: ''
    })
  }

  const handleAddProduct = async () => {
    if (!userStore || !user) {
      toast.error('Store information not found')
        return
      }

    if (!productForm.name || !productForm.description || !productForm.price || !productForm.category || !productForm.stock) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const newProduct = await createProduct({
        storeId: userStore.id!,
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      category: productForm.category,
      stock: parseInt(productForm.stock),
        image: productForm.image || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=400&fit=crop'
      })

      setProducts([newProduct, ...products])
    resetProductForm()
    setShowAddProduct(false)
    toast.success('Product added successfully!')
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Failed to add product')
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      image: product.image
    })
  }

  const handleUpdateProduct = async () => {
    if (!editingProduct) return

    if (!productForm.name || !productForm.description || !productForm.price || !productForm.category || !productForm.stock) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      await updateProduct(editingProduct.id!, {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      category: productForm.category,
      stock: parseInt(productForm.stock),
        image: productForm.image
      })

      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...productForm, price: parseFloat(productForm.price), stock: parseInt(productForm.stock) }
          : p
      ))

    setEditingProduct(null)
    resetProductForm()
    toast.success('Product updated successfully!')
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Failed to update product')
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await deleteProduct(productId)
      setProducts(products.filter(p => p.id !== productId))
      toast.success('Product deleted successfully!')
      } catch (error) {
        console.error('Error deleting product:', error)
        toast.error('Failed to delete product')
    }
  }

  const handleVerifyStore = async (store: Store) => {
    try {
      const response = await fetch('/api/admin/verify-store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId: store.id })
      })
      
      if (response.ok) {
        setPendingStores(pendingStores.filter(s => s.id !== store.id))
        setSelectedStore(null)
        toast.success('Store verified and email sent!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to verify store')
      }
    } catch (error) {
      console.error('Error verifying store:', error)
      toast.error('Failed to verify store')
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Admin Dashboard
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to access the dashboard
            </p>
          </div>
          <button
            onClick={handleSignIn}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    )
  }

  // Seller with pending application
  if (userRole === 'seller' && userStore?.status === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6">
              <div className="flex items-center mb-4">
                <Clock className="w-8 h-8 text-yellow-600 mr-3" />
                <h2 className="text-xl font-semibold text-yellow-800">
                  Application Under Review
                </h2>
              </div>
              <p className="text-yellow-700">
                Your seller application for <strong>{userStore.storeName}</strong> is currently being reviewed by our team. 
                We'll send you an email at <strong>{userStore.contactEmail}</strong> once it's been processed.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Regular user (not admin or verified seller)
  if (userRole === 'user' || (userRole === 'seller' && !userStore)) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
            
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Access Denied
              </h2>
              <p className="text-gray-600 mb-6">
                You don't have permission to access this dashboard.
              </p>
              <button
                onClick={() => router.push('/become-seller')}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Apply to Become a Seller
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const totalOrders = orders.length
  const totalProducts = products.length
  const pendingOrders = orders.filter(order => order.status === 'pending').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Left: Logo & Title */}
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <span className="text-sm sm:text-xl font-bold text-gray-900 truncate">
                {userRole === 'admin' ? (
                  <>
                    <span className="hidden sm:inline">Admin Dashboard</span>
                    <span className="sm:hidden">Admin</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">{userStore?.storeName || 'Seller'} Dashboard</span>
                    <span className="sm:hidden">{userStore?.storeName || 'Seller'}</span>
                  </>
                )}
              </span>
              </div>

            {/* Right: Email & Buttons */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Email - Hidden on mobile */}
              <span className="hidden lg:block text-sm text-gray-600 truncate max-w-[150px] xl:max-w-none">
                {user.email}
              </span>

              {/* Manage Platform Button - Admin Only */}
              {userRole === 'admin' && (
                <Link
                  href="/admin/manage"
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Manage Platform"
                >
                  <UserCog className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="hidden md:inline text-sm">Manage</span>
                </Link>
              )}

              {/* Logout Button */}
            <button
              onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2 text-gray-700 hover:text-red-600 transition-colors p-1.5 sm:p-0"
                title="Logout"
            >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="hidden sm:inline text-sm">Logout</span>
            </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Navigation Tabs */}
        <div className="mb-6 sm:mb-8 -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="border-b border-gray-200 overflow-x-auto scrollbar-hide">
            <nav className="flex space-x-4 sm:space-x-8 min-w-max sm:min-w-0">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'products', label: 'Products', icon: Package },
                ...(userRole === 'admin' ? [
              { id: 'orders', label: 'Orders', icon: ShoppingCart },
                  { id: 'sellers', label: 'Sellers', icon: Users }
                ] : [])
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-1.5 sm:space-x-2 py-3 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                  <tab.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>{tab.label}</span>
                  {tab.id === 'sellers' && pendingStores.length > 0 && (
                    <span className="ml-1 sm:ml-2 bg-red-500 text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                      {pendingStores.length}
                    </span>
                  )}
              </button>
            ))}
          </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Dashboard Overview</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {userRole === 'admin' && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ShoppingCart className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                  </div>
                </div>
              </div>
              )}

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Package className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {userRole === 'admin' ? 'Total Products' : 'My Products'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                  </div>
                </div>
              </div>

              {userRole === 'admin' && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Users className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                      <p className="text-2xl font-bold text-gray-900">{pendingStores.length}</p>
                  </div>
                </div>
              </div>
              )}
            </div>

            {/* Store Info for Sellers */}
            {userRole === 'seller' && userStore && (
              <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Store Information</h2>
                  <Link
                    href="/admin/store-settings"
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Palette className="w-4 h-4" />
                    <span>Customize Store</span>
                  </Link>
              </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Store Name</p>
                    <p className="font-medium text-gray-900">{userStore.storeName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact Email</p>
                    <p className="font-medium text-gray-900">{userStore.contactEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      {userStore.status}
                          </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Branding</p>
                    <p className="text-sm text-gray-500">
                      {userStore.branding?.logo || userStore.branding?.banner ? 'Customized' : 'Using defaults'}
                    </p>
              </div>
            </div>
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Products Management</h1>
              {userRole === 'seller' && userStore?.status === 'verified' && (
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Product</span>
                </button>
              )}
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      {userRole === 'seller' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.description.substring(0, 50)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(() => {
                            // If this is a seller dashboard, use their store's currency
                            if (userStore?.currency) {
                              return formatPrice(product.price, userStore.currency)
                            }
                            // For admin, find the product's store currency
                            const productStore = allStores.find(s => s.id === product.storeId)
                            const currency = productStore?.currency || 'USD'
                            return formatPrice(product.price, currency)
                          })()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.stock}
                        </td>
                        {userRole === 'seller' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                                className="text-blue-600 hover:text-blue-900"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900"
                                onClick={() => handleDeleteProduct(product.id!)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab (Admin only) */}
        {activeTab === 'orders' && userRole === 'admin' && (
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Orders Management</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.id?.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                            <div className="text-sm text-gray-500">{order.customerEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.items.length} items
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(() => {
                            // Check if order has items with currency info
                            const currencies = order.items
                              .map((item: any) => item.currency)
                              .filter((c: string) => c)
                            
                            if (currencies.length === 0) {
                              // No currency info, just show number
                              return order.total.toFixed(2)
                            }
                            
                            const uniqueCurrencies = [...new Set(currencies)]
                            
                            if (uniqueCurrencies.length > 1) {
                              // Mixed currencies
                              return <span className="text-orange-600 font-semibold">Mixed</span>
                            } else {
                              // Single currency
                              return formatPrice(order.total, uniqueCurrencies[0])
                            }
                          })()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Pending Sellers Tab (Admin only) */}
        {activeTab === 'sellers' && userRole === 'admin' && (
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Pending Seller Applications</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingStores.map((store) => (
                <div key={store.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {store.storeName}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Owner:</span> {store.ownerUid.substring(0, 8)}...
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {store.contactEmail}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedStore(store)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mb-2"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>

            {pendingStores.length === 0 && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">No pending applications</p>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {(showAddProduct || editingProduct) && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddProduct(false)
                    setEditingProduct(null)
                    resetProductForm()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description *</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter product description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock *</label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select category</option>
                    <option value="Technology">Technology</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Jewelry">Jewelry</option>
                    <option value="Food">Food</option>
                    <option value="Lifestyle">Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                      type="text"
                      value={productForm.image}
                      onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddProduct(false)
                      setEditingProduct(null)
                      resetProductForm()
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingProduct ? 'Update' : 'Add'} Product</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Store Details Modal */}
        {selectedStore && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-2xl max-w-2xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedStore.storeName}
                </h3>
                <button
                  onClick={() => setSelectedStore(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Contact Email</h4>
                  <p className="text-gray-900">{selectedStore.contactEmail}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Product Details</h4>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedStore.applicationDetails.productInfo}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Social Media Links</h4>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedStore.applicationDetails.socialMediaLinks || 'None provided'}</p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setSelectedStore(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleVerifyStore(selectedStore)}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Verify Store</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
