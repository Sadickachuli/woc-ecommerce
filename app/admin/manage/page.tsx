'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Package, 
  Store as StoreIcon, 
  Trash2, 
  Shield, 
  UserCog,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Clock
} from 'lucide-react'
import { onAuthChange } from '@/lib/firebase/auth'
import { 
  getUser, 
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllProducts,
  deleteProduct,
  getAllStores,
  updateStoreStatus,
  deleteStore,
  cleanupOrphanedStores,
  User,
  Product,
  Store
} from '@/lib/firebase/firestore'
import { User as FirebaseUser } from 'firebase/auth'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function AdminManagePage() {
  const router = useRouter()
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'users' | 'products' | 'stores'>('users')

  // Data
  const [users, setUsers] = useState<User[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [stores, setStores] = useState<Store[]>([])

  // Loading states
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [loadingStores, setLoadingStores] = useState(false)
  const [cleaningUp, setCleaningUp] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthChange(async (currentUser) => {
      setUser(currentUser)
      
      if (currentUser) {
        const userData = await getUser(currentUser.uid)
        
        if (userData && userData.role === 'admin') {
          setUserRole(userData.role)
          // Load initial data
          loadUsers()
          loadProducts()
          loadStores()
        } else {
          router.push('/admin/dashboard')
        }
      } else {
        router.push('/admin')
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const loadUsers = async () => {
    setLoadingUsers(true)
    try {
      const allUsers = await getAllUsers()
      setUsers(allUsers)
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoadingUsers(false)
    }
  }

  const loadProducts = async () => {
    setLoadingProducts(true)
    try {
      const allProducts = await getAllProducts()
      setProducts(allProducts)
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoadingProducts(false)
    }
  }

  const loadStores = async () => {
    setLoadingStores(true)
    try {
      const allStores = await getAllStores()
      setStores(allStores)
    } catch (error) {
      console.error('Error loading stores:', error)
      toast.error('Failed to load stores')
    } finally {
      setLoadingStores(false)
    }
  }

  const handleDeleteUser = async (userId: string, userEmail: string, userRole: string) => {
    const isSeller = userRole === 'seller'
    const message = isSeller
      ? `Are you sure you want to delete user "${userEmail}"? This will also delete their store and all products. This action cannot be undone.`
      : `Are you sure you want to delete user "${userEmail}"? This action cannot be undone.`
    
    if (!confirm(message)) {
      return
    }

    try {
      await deleteUser(userId)
      toast.success(isSeller ? 'User, store, and products deleted successfully' : 'User deleted successfully')
      loadUsers()
      // Reload products and stores if a seller was deleted
      if (isSeller) {
        loadProducts()
        loadStores()
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    }
  }

  const handleChangeUserRole = async (userId: string, newRole: 'admin' | 'seller' | 'user') => {
    try {
      await updateUserRole(userId, newRole)
      toast.success(`User role updated to ${newRole}`)
      loadUsers()
    } catch (error) {
      console.error('Error updating user role:', error)
      toast.error('Failed to update user role')
    }
  }

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete product "${productName}"? This action cannot be undone.`)) {
      return
    }

    try {
      await deleteProduct(productId)
      toast.success('Product deleted successfully')
      loadProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  const handleDeleteStore = async (storeId: string, storeName: string) => {
    if (!confirm(`Are you sure you want to delete store "${storeName}"? This will also delete all products from this store. This action cannot be undone.`)) {
      return
    }

    try {
      await deleteStore(storeId)
      toast.success('Store deleted successfully')
      loadStores()
      loadProducts()
    } catch (error) {
      console.error('Error deleting store:', error)
      toast.error('Failed to delete store')
    }
  }

  const handleRevokeVerification = async (storeId: string, storeName: string) => {
    if (!confirm(`Are you sure you want to revoke verification for "${storeName}"?`)) {
      return
    }

    try {
      await updateStoreStatus(storeId, 'pending')
      toast.success('Store verification revoked')
      loadStores()
    } catch (error) {
      console.error('Error revoking verification:', error)
      toast.error('Failed to revoke verification')
    }
  }

  const handleCleanupOrphanedStores = async () => {
    if (!confirm('This will delete all stores whose owners no longer exist. Continue?')) {
      return
    }

    setCleaningUp(true)
    try {
      const deletedCount = await cleanupOrphanedStores()
      toast.success(`Cleaned up ${deletedCount} orphaned store${deletedCount !== 1 ? 's' : ''}`)
      loadStores()
      loadProducts()
    } catch (error) {
      console.error('Error cleaning up orphaned stores:', error)
      toast.error('Failed to clean up orphaned stores')
    } finally {
      setCleaningUp(false)
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

  if (!user || userRole !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Management</h1>
          <p className="text-gray-600">Manage users, products, and stores</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'users'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-5 h-5 inline-block mr-2" />
                Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'products'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Package className="w-5 h-5 inline-block mr-2" />
                Products ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('stores')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'stores'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <StoreIcon className="w-5 h-5 inline-block mr-2" />
                Stores ({stores.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                  <button
                    onClick={loadUsers}
                    disabled={loadingUsers}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {loadingUsers ? 'Loading...' : 'Refresh'}
                  </button>
                </div>

                {loadingUsers ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading users...</p>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No users found
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((userData) => (
                          <tr key={userData.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Users className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {userData.email}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ID: {userData.id}
                                  </div>
                                  {userData.role === 'seller' && (() => {
                                    const userStore = stores.find(s => s.ownerUid === userData.id)
                                    return userStore ? (
                                      <div className="text-xs text-green-600 mt-1">
                                        Store: {userStore.storeName}
                                      </div>
                                    ) : (
                                      <div className="text-xs text-red-600 mt-1">
                                        ⚠️ No store found
                                      </div>
                                    )
                                  })()}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={userData.role}
                                onChange={(e) => handleChangeUserRole(userData.id!, e.target.value as any)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  userData.role === 'admin'
                                    ? 'bg-red-100 text-red-800'
                                    : userData.role === 'seller'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                <option value="user">User</option>
                                <option value="seller">Seller</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {userData.role !== 'admin' && (
                                <button
                                  onClick={() => handleDeleteUser(userData.id!, userData.email, userData.role)}
                                  className="text-red-600 hover:text-red-900"
                                  title={userData.role === 'seller' ? 'Delete user, store, and products' : 'Delete user'}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Product Management</h2>
                  <button
                    onClick={loadProducts}
                    disabled={loadingProducts}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {loadingProducts ? 'Loading...' : 'Refresh'}
                  </button>
                </div>

                {loadingProducts ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading products...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No products found
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => {
                      const productStore = stores.find(s => s.id === product.storeId)
                      return (
                        <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                          <div className="h-40 bg-gray-200">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-12 h-12 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">
                              Store: {productStore?.storeName || 'Unknown'}
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold text-blue-600">
                                ${product.price.toFixed(2)}
                              </span>
                              <button
                                onClick={() => handleDeleteProduct(product.id!, product.name)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Delete product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Stores Tab */}
            {activeTab === 'stores' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Store Management</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCleanupOrphanedStores}
                      disabled={cleaningUp || loadingStores}
                      className="px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-orange-400"
                      title="Delete stores whose owners no longer exist"
                    >
                      {cleaningUp ? 'Cleaning...' : 'Clean Up Orphaned'}
                    </button>
                    <button
                      onClick={loadStores}
                      disabled={loadingStores}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                    >
                      {loadingStores ? 'Loading...' : 'Refresh'}
                    </button>
                  </div>
                </div>

                {loadingStores ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading stores...</p>
                  </div>
                ) : stores.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No stores found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stores.map((store) => {
                      const storeProducts = products.filter(p => p.storeId === store.id)
                      const storeOwner = users.find(u => u.id === store.ownerUid)
                      const isOrphaned = !storeOwner
                      
                      return (
                        <div key={store.id} className={`border rounded-lg p-6 ${
                          isOrphaned ? 'bg-red-50 border-red-300' : 'bg-white border-gray-200'
                        }`}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {store.storeName}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  store.status === 'verified'
                                    ? 'bg-green-100 text-green-800'
                                    : store.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {store.status === 'verified' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                                  {store.status === 'pending' && <Clock className="w-3 h-3 inline mr-1" />}
                                  {store.status === 'rejected' && <XCircle className="w-3 h-3 inline mr-1" />}
                                  {store.status}
                                </span>
                                {isOrphaned && (
                                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-200 text-red-900">
                                    ⚠️ ORPHANED
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{store.contactEmail}</p>
                              <p className="text-xs text-gray-500 mb-2">
                                Owner UID: {store.ownerUid} {storeOwner && `(${storeOwner.email})`}
                              </p>
                              <p className="text-sm text-gray-500">
                                Products: {storeProducts.length} | Currency: {store.currency || 'USD'}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              {store.status === 'verified' && (
                                <button
                                  onClick={() => handleRevokeVerification(store.id!, store.storeName)}
                                  className="px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
                                  title="Revoke verification"
                                >
                                  <AlertTriangle className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteStore(store.id!, store.storeName)}
                                className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                                title="Delete store"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

