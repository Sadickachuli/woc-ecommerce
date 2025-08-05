import { Product, Order } from '../types'

// In-memory data store (works on Vercel serverless)
let products: Product[] = [
  {
    id: '1',
    name: 'Innovative Solar Charger',
    description: 'A portable solar charger designed for rural communities in Ghana. Provides reliable power for mobile devices and small appliances.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=400&fit=crop',
    category: 'Technology',
    stock: 50,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Organic Shea Butter Cream',
    description: 'Handcrafted shea butter cream made from locally sourced ingredients. Perfect for skin care and hair treatment.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
    category: 'Beauty',
    stock: 100,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    name: 'Recycled Plastic Bags',
    description: 'Eco-friendly bags made from recycled plastic materials. Durable and stylish for everyday use.',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400&h=400&fit=crop',
    category: 'Fashion',
    stock: 75,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: '4',
    name: 'Traditional Bead Jewelry',
    description: 'Handmade traditional bead jewelry crafted by local artisans. Each piece tells a unique story.',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
    category: 'Jewelry',
    stock: 30,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '5',
    name: 'Local Honey',
    description: 'Pure, natural honey harvested from local beekeepers. Rich in flavor and health benefits.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop',
    category: 'Food',
    stock: 60,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
  },
  {
    id: '6',
    name: 'Bamboo Water Bottle',
    description: 'Sustainable bamboo water bottle with natural antibacterial properties. Perfect for eco-conscious consumers.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
    category: 'Lifestyle',
    stock: 40,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: '7',
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable organic cotton t-shirt made from sustainable materials. Perfect for everyday wear.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    category: 'clothing',
    stock: 50,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
]

let orders: Order[] = []

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined'

// Enhanced localStorage operations for better persistence
const STORAGE_KEYS = {
  PRODUCTS: 'woc_products_v2',
  ORDERS: 'woc_orders_v2'
}

// Save products to localStorage with backup
const saveProductsToStorage = (productsToSave: Product[]) => {
  if (!isBrowser) return
  
  try {
    const dataToStore = {
      products: productsToSave,
      timestamp: new Date().toISOString(),
      version: '2.0'
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(dataToStore))
    console.log('Products saved to localStorage:', productsToSave.length)
  } catch (error) {
    console.error('Failed to save products to localStorage:', error)
  }
}

// Load products from localStorage with validation
const loadProductsFromStorage = (): Product[] => {
  if (!isBrowser) return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
    if (stored) {
      const parsed = JSON.parse(stored)
      
      // Handle both old and new format
      const productsData = parsed.products || parsed
      
      if (Array.isArray(productsData)) {
        const loadedProducts = productsData.map((product: any) => ({
          ...product,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt)
        }))
        console.log('Products loaded from localStorage:', loadedProducts.length)
        return loadedProducts
      }
    }
  } catch (error) {
    console.error('Failed to load products from localStorage:', error)
  }
  return []
}

// Save orders to localStorage
const saveOrdersToStorage = (ordersToSave: Order[]) => {
  if (!isBrowser) return
  
  try {
    const dataToStore = {
      orders: ordersToSave,
      timestamp: new Date().toISOString(),
      version: '2.0'
    }
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(dataToStore))
    console.log('Orders saved to localStorage:', ordersToSave.length)
  } catch (error) {
    console.error('Failed to save orders to localStorage:', error)
  }
}

// Load orders from localStorage
const loadOrdersFromStorage = (): Order[] => {
  if (!isBrowser) return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ORDERS)
    if (stored) {
      const parsed = JSON.parse(stored)
      const ordersData = parsed.orders || parsed
      
      if (Array.isArray(ordersData)) {
        return ordersData.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt)
        }))
      }
    }
  } catch (error) {
    console.error('Failed to load orders from localStorage:', error)
  }
  return []
}

// Initialize data from localStorage on browser
if (isBrowser) {
  const storedProducts = loadProductsFromStorage()
  if (storedProducts.length > 0) {
    products = storedProducts
  }
  
  const storedOrders = loadOrdersFromStorage()
  if (storedOrders.length > 0) {
    orders = storedOrders
  }
}

// Export functions to get current data
export const getProducts = (): Product[] => {
  // In browser, try to load fresh data from localStorage
  if (isBrowser) {
    const storedProducts = loadProductsFromStorage()
    if (storedProducts.length > 0) {
      products = storedProducts
    }
  }
  return [...products]
}

export const getOrders = (): Order[] => {
  // In browser, try to load fresh data from localStorage
  if (isBrowser) {
    const storedOrders = loadOrdersFromStorage()
    if (storedOrders.length > 0) {
      orders = storedOrders
    }
  }
  return [...orders]
}

// Callback system for product updates
let productUpdateCallbacks: (() => void)[] = []

export const subscribeToProductUpdates = (callback: () => void) => {
  productUpdateCallbacks.push(callback)
  return () => {
    const index = productUpdateCallbacks.indexOf(callback)
    if (index > -1) {
      productUpdateCallbacks.splice(index, 1)
    }
  }
}

const notifyProductUpdate = () => {
  productUpdateCallbacks.forEach(callback => callback())
}

export const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  products.push(newProduct)
  saveProductsToStorage(products)
  console.log('Product added:', newProduct.name, 'Total products:', products.length)
  notifyProductUpdate()
  return newProduct
}

export const updateProduct = (id: string, updates: Partial<Product>): Product | null => {
  const index = products.findIndex(p => p.id === id)
  if (index !== -1) {
    products[index] = { ...products[index], ...updates, updatedAt: new Date() }
    saveProductsToStorage(products)
    console.log('Product updated:', products[index].name)
    notifyProductUpdate()
    return products[index]
  }
  return null
}

export const deleteProduct = (id: string): boolean => {
  const index = products.findIndex(p => p.id === id)
  if (index !== -1) {
    const deletedProduct = products[index]
    products.splice(index, 1)
    saveProductsToStorage(products)
    console.log('Product deleted:', deletedProduct.name, 'Total products:', products.length)
    notifyProductUpdate()
    return true
  }
  return false
}

export const addOrder = (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
  const newOrder: Order = {
    ...order,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  orders.push(newOrder)
  saveOrdersToStorage(orders)
  return newOrder
}

export const updateOrderStatus = (id: string, status: Order['status']): Order | null => {
  const order = orders.find(o => o.id === id)
  if (order) {
    order.status = status
    order.updatedAt = new Date()
    saveOrdersToStorage(orders)
    return order
  }
  return null
}

// Data export/import functionality for backup
export const exportData = () => {
  return {
    products,
    orders,
    timestamp: new Date().toISOString(),
    version: '2.0'
  }
}

export const importData = (data: any) => {
  if (data.products && Array.isArray(data.products)) {
    products = data.products.map((product: any) => ({
      ...product,
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt)
    }))
    saveProductsToStorage(products)
  }
  
  if (data.orders && Array.isArray(data.orders)) {
    orders = data.orders.map((order: any) => ({
      ...order,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt)
    }))
    saveOrdersToStorage(orders)
  }
  
  notifyProductUpdate()
}