import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  serverTimestamp,
  QueryConstraint
} from 'firebase/firestore'
import { db } from './config'

// Type definitions
export interface User {
  id?: string // Firestore document ID (same as uid)
  uid: string
  email: string
  displayName: string
  role: 'admin' | 'seller' | 'user'
  storeId?: string
}

export interface Store {
  id?: string
  ownerUid: string
  storeName: string
  status: 'pending' | 'verified' | 'rejected'
  contactEmail: string
  currency?: string // Store's preferred currency (USD, EUR, GBP, NGN, etc.)
  applicationDetails: {
    productInfo: string
    socialMediaLinks: string
    sampleImages?: string[]
  }
  branding?: {
    logo?: string
    banner?: string
    primaryColor?: string
    accentColor?: string
    description?: string
    tagline?: string
  }
  createdAt: Timestamp | ReturnType<typeof serverTimestamp>
}

export interface Product {
  id?: string
  storeId: string
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
  createdAt?: Timestamp | ReturnType<typeof serverTimestamp>
}

export interface Order {
  id?: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  customerAddress: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  createdAt?: Timestamp | ReturnType<typeof serverTimestamp>
}

export interface OrderItem {
  productId: string
  storeId: string
  productName: string
  price: number
  quantity: number
  currency?: string
}

// User operations
export const createUser = async (userData: User) => {
  try {
    const userRef = doc(db, 'users', userData.uid)
    // Use setDoc with merge to create or update the document with the UID as document ID
    await setDoc(userRef, userData, { merge: true })
    return userData
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

export const getUser = async (uid: string): Promise<User | null> => {
  try {
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      return userSnap.data() as User
    }
    return null
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

export const updateUserRole = async (uid: string, role: User['role'], storeId?: string) => {
  try {
    const userRef = doc(db, 'users', uid)
    const updates: any = { role }
    if (storeId) updates.storeId = storeId
    
    // Use setDoc with merge to create if doesn't exist
    await setDoc(userRef, updates, { merge: true })
  } catch (error) {
    console.error('Error updating user role:', error)
    throw error
  }
}

// Store operations
export const createStore = async (storeData: Omit<Store, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'stores'), {
      ...storeData,
      createdAt: serverTimestamp()
    })
    return { id: docRef.id, ...storeData }
  } catch (error) {
    console.error('Error creating store:', error)
    throw error
  }
}

export const getStore = async (storeId: string): Promise<Store | null> => {
  try {
    const storeRef = doc(db, 'stores', storeId)
    const storeSnap = await getDoc(storeRef)
    
    if (storeSnap.exists()) {
      return { id: storeSnap.id, ...storeSnap.data() } as Store
    }
    return null
  } catch (error) {
    console.error('Error getting store:', error)
    return null
  }
}

export const getStoreByOwner = async (ownerUid: string): Promise<Store | null> => {
  try {
    const q = query(collection(db, 'stores'), where('ownerUid', '==', ownerUid))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      return { id: doc.id, ...doc.data() } as Store
    }
    return null
  } catch (error) {
    console.error('Error getting store by owner:', error)
    return null
  }
}

export const getPendingStores = async (): Promise<Store[]> => {
  try {
    const q = query(
      collection(db, 'stores'), 
      where('status', '==', 'pending')
    )
    const querySnapshot = await getDocs(q)
    
    // Sort by createdAt in JavaScript instead
    const stores = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Store))
    
    return stores.sort((a, b) => {
      const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0
      const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0
      return bTime - aTime // desc order
    })
  } catch (error) {
    console.error('Error getting pending stores:', error)
    return []
  }
}

export const updateStoreStatus = async (storeId: string, status: Store['status']) => {
  try {
    const storeRef = doc(db, 'stores', storeId)
    await updateDoc(storeRef, { status })
  } catch (error) {
    console.error('Error updating store status:', error)
    throw error
  }
}

export const updateStoreBranding = async (storeId: string, updates: Partial<Store>) => {
  try {
    const storeRef = doc(db, 'stores', storeId)
    await updateDoc(storeRef, updates as any)
  } catch (error) {
    console.error('Error updating store branding:', error)
    throw error
  }
}

// Product operations
export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: serverTimestamp()
    })
    return { id: docRef.id, ...productData }
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

export const getProduct = async (productId: string): Promise<Product | null> => {
  try {
    const productRef = doc(db, 'products', productId)
    const productSnap = await getDoc(productRef)
    
    if (productSnap.exists()) {
      return { id: productSnap.id, ...productSnap.data() } as Product
    }
    return null
  } catch (error) {
    console.error('Error getting product:', error)
    return null
  }
}

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'))
    
    // Sort by createdAt in JavaScript instead
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product))
    
    return products.sort((a, b) => {
      const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0
      const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0
      return bTime - aTime // desc order
    })
  } catch (error) {
    console.error('Error getting all products:', error)
    return []
  }
}

export const getProductsByStore = async (storeId: string): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, 'products'), 
      where('storeId', '==', storeId)
    )
    const querySnapshot = await getDocs(q)
    
    // Sort by createdAt in JavaScript instead
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product))
    
    return products.sort((a, b) => {
      const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0
      const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0
      return bTime - aTime // desc order
    })
  } catch (error) {
    console.error('Error getting products by store:', error)
    return []
  }
}

export const getProductsFromVerifiedStores = async (): Promise<Product[]> => {
  try {
    // First, get all verified stores
    const storesQuery = query(
      collection(db, 'stores'),
      where('status', '==', 'verified')
    )
    const storesSnapshot = await getDocs(storesQuery)
    const verifiedStoreIds = storesSnapshot.docs.map(doc => doc.id)
    
    if (verifiedStoreIds.length === 0) {
      return []
    }
    
    // Then, get all products from verified stores
    // Note: Firestore 'in' queries are limited to 10 items, so we need to batch if there are more
    const products: Product[] = []
    
    for (let i = 0; i < verifiedStoreIds.length; i += 10) {
      const batch = verifiedStoreIds.slice(i, i + 10)
      const q = query(
        collection(db, 'products'),
        where('storeId', 'in', batch)
      )
      const querySnapshot = await getDocs(q)
      
      products.push(...querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product)))
    }
    
    // Sort by createdAt in JavaScript instead
    return products.sort((a, b) => {
      const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0
      const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0
      return bTime - aTime // desc order
    })
  } catch (error) {
    console.error('Error getting products from verified stores:', error)
    return []
  }
}

export const updateProduct = async (productId: string, updates: Partial<Product>) => {
  try {
    const productRef = doc(db, 'products', productId)
    await updateDoc(productRef, updates as any)
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

export const deleteProduct = async (productId: string) => {
  try {
    const productRef = doc(db, 'products', productId)
    await deleteDoc(productRef)
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

// Order operations
export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      createdAt: serverTimestamp()
    })
    return { id: docRef.id, ...orderData }
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

export const getOrder = async (orderId: string): Promise<Order | null> => {
  try {
    const orderRef = doc(db, 'orders', orderId)
    const orderSnap = await getDoc(orderRef)
    
    if (orderSnap.exists()) {
      return { id: orderSnap.id, ...orderSnap.data() } as Order
    }
    return null
  } catch (error) {
    console.error('Error getting order:', error)
    return null
  }
}

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order))
  } catch (error) {
    console.error('Error getting all orders:', error)
    return []
  }
}

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  try {
    const orderRef = doc(db, 'orders', orderId)
    await updateDoc(orderRef, { status })
  } catch (error) {
    console.error('Error updating order status:', error)
    throw error
  }
}

// Admin management functions
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'))
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as User))
  } catch (error) {
    console.error('Error getting all users:', error)
    return []
  }
}

export const deleteUser = async (userId: string) => {
  try {
    console.log(`🗑️ Deleting user with ID: ${userId}`)
    
    // First, check if user is a seller and has a store
    console.log(`🔍 Searching for stores with ownerUid: ${userId}`)
    const userStore = await getStoreByOwner(userId)
    
    if (userStore) {
      console.log(`✅ Found store: ${userStore.storeName} (ID: ${userStore.id})`)
      console.log(`📦 Store ownerUid: ${userStore.ownerUid}`)
      
      // Delete the store (which will also delete all products)
      console.log(`🗑️ Deleting store ${userStore.storeName}...`)
      await deleteStore(userStore.id!)
      console.log(`✅ Deleted store ${userStore.storeName} and all its products`)
    } else {
      console.log(`ℹ️ No store found for user ${userId}`)
    }
    
    // Then delete the user
    console.log(`🗑️ Deleting user document...`)
    await deleteDoc(doc(db, 'users', userId))
    console.log(`✅ User deleted successfully`)
  } catch (error) {
    console.error('❌ Error deleting user:', error)
    throw error
  }
}

export const getAllStores = async (): Promise<Store[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'stores'))
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Store))
  } catch (error) {
    console.error('Error getting all stores:', error)
    return []
  }
}

export const deleteStore = async (storeId: string) => {
  try {
    // Delete all products from this store first
    const productsQuery = query(collection(db, 'products'), where('storeId', '==', storeId))
    const productsSnapshot = await getDocs(productsQuery)
    
    const deletePromises = productsSnapshot.docs.map(doc => deleteDoc(doc.ref))
    await Promise.all(deletePromises)
    
    // Then delete the store
    await deleteDoc(doc(db, 'stores', storeId))
  } catch (error) {
    console.error('Error deleting store:', error)
    throw error
  }
}

// Clean up orphaned stores (stores whose owners don't exist)
export const cleanupOrphanedStores = async () => {
  try {
    const allStores = await getAllStores()
    const allUsers = await getAllUsers()
    
    const userIds = new Set(allUsers.map(u => u.id))
    const orphanedStores = allStores.filter(store => !userIds.has(store.ownerUid))
    
    console.log(`Found ${orphanedStores.length} orphaned stores`)
    
    for (const store of orphanedStores) {
      console.log(`Deleting orphaned store: ${store.storeName} (owner: ${store.ownerUid})`)
      await deleteStore(store.id!)
    }
    
    return orphanedStores.length
  } catch (error) {
    console.error('Error cleaning up orphaned stores:', error)
    throw error
  }
}

