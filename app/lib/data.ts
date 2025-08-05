import { Product, Order } from '../types'

// In-memory data store (in a real app, this would be a database)
export let products: Product[] = [
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

export let orders: Order[] = []

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined'

// Save products to localStorage (client-side only)
const saveProductsToStorage = () => {
  if (!isBrowser) return
  
  try {
    localStorage.setItem('ecommerce_products', JSON.stringify(products))
    console.log('Products saved to localStorage:', products.length)
  } catch (error) {
    console.error('Failed to save products to localStorage:', error)
  }
}

// Load products from localStorage (client-side only)
const loadProductsFromStorage = () => {
  if (!isBrowser) return
  
  try {
    const stored = localStorage.getItem('ecommerce_products')
    if (stored) {
      const parsed = JSON.parse(stored)
      // Convert date strings back to Date objects
      products = parsed.map((product: any) => ({
        ...product,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt)
      }))
      console.log('Products loaded from localStorage:', products.length)
    }
  } catch (error) {
    console.error('Failed to load products from localStorage:', error)
  }
}

// Initialize products from localStorage (only in browser)
if (isBrowser) {
  loadProductsFromStorage()
}

// Export initialization function for client-side use
export const initializeProducts = () => {
  if (isBrowser) {
    loadProductsFromStorage()
  }
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

export const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  products.push(newProduct)
  saveProductsToStorage()
  console.log('Product added:', newProduct.name, 'Total products:', products.length)
  notifyProductUpdate()
  return newProduct
}

export const updateProduct = (id: string, updates: Partial<Product>) => {
  const index = products.findIndex(p => p.id === id)
  if (index !== -1) {
    products[index] = { ...products[index], ...updates, updatedAt: new Date() }
    saveProductsToStorage()
    console.log('Product updated:', products[index].name)
    notifyProductUpdate()
    return products[index]
  }
  return null
}

export const deleteProduct = (id: string) => {
  const index = products.findIndex(p => p.id === id)
  if (index !== -1) {
    const deletedProduct = products[index]
    products.splice(index, 1)
    saveProductsToStorage()
    console.log('Product deleted:', deletedProduct.name, 'Total products:', products.length)
    notifyProductUpdate()
    return true
  }
  return false
}

export const getProducts = () => {
  console.log('Getting products, total count:', products.length)
  return [...products]
}

export const addOrder = (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newOrder: Order = {
    ...order,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  orders.push(newOrder)
  return newOrder
}

export const updateOrderStatus = (id: string, status: Order['status']) => {
  const order = orders.find(o => o.id === id)
  if (order) {
    order.status = status
    order.updatedAt = new Date()
    return order
  }
  return null
} 