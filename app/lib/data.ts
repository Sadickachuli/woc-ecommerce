import { Product, Order } from '../types'
import fs from 'fs'
import path from 'path'

// File paths for JSON storage
const productsFilePath = path.join(process.cwd(), 'data', 'products.json')
const ordersFilePath = path.join(process.cwd(), 'data', 'orders.json')

// Helper function to ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Helper function to read products from JSON file
const readProductsFromFile = (): Product[] => {
  try {
    ensureDataDirectory()
    if (!fs.existsSync(productsFilePath)) {
      // If file doesn't exist, create it with default products
      const defaultProducts: Product[] = [
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
      writeProductsToFile(defaultProducts)
      return defaultProducts
    }
    
    const data = fs.readFileSync(productsFilePath, 'utf-8')
    const parsed = JSON.parse(data)
    
    // Convert date strings back to Date objects
    return parsed.map((product: any) => ({
      ...product,
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt)
    }))
  } catch (error) {
    console.error('Error reading products from file:', error)
    return []
  }
}

// Helper function to write products to JSON file
const writeProductsToFile = (products: Product[]) => {
  try {
    ensureDataDirectory()
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2))
    console.log('Products saved to file:', products.length)
  } catch (error) {
    console.error('Error writing products to file:', error)
  }
}

// Helper function to read orders from JSON file
const readOrdersFromFile = (): Order[] => {
  try {
    ensureDataDirectory()
    if (!fs.existsSync(ordersFilePath)) {
      // If file doesn't exist, create it with empty array
      fs.writeFileSync(ordersFilePath, JSON.stringify([]))
      return []
    }
    
    const data = fs.readFileSync(ordersFilePath, 'utf-8')
    const parsed = JSON.parse(data)
    
    // Convert date strings back to Date objects
    return parsed.map((order: any) => ({
      ...order,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt)
    }))
  } catch (error) {
    console.error('Error reading orders from file:', error)
    return []
  }
}

// Helper function to write orders to JSON file
const writeOrdersToFile = (orders: Order[]) => {
  try {
    ensureDataDirectory()
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2))
    console.log('Orders saved to file:', orders.length)
  } catch (error) {
    console.error('Error writing orders to file:', error)
  }
}

// Export functions to get current data
export const getProducts = (): Product[] => {
  return readProductsFromFile()
}

export const getOrders = (): Order[] => {
  return readOrdersFromFile()
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
  const products = readProductsFromFile()
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  products.push(newProduct)
  writeProductsToFile(products)
  console.log('Product added:', newProduct.name, 'Total products:', products.length)
  notifyProductUpdate()
  return newProduct
}

export const updateProduct = (id: string, updates: Partial<Product>): Product | null => {
  const products = readProductsFromFile()
  const index = products.findIndex(p => p.id === id)
  if (index !== -1) {
    products[index] = { ...products[index], ...updates, updatedAt: new Date() }
    writeProductsToFile(products)
    console.log('Product updated:', products[index].name)
    notifyProductUpdate()
    return products[index]
  }
  return null
}

export const deleteProduct = (id: string): boolean => {
  const products = readProductsFromFile()
  const index = products.findIndex(p => p.id === id)
  if (index !== -1) {
    const deletedProduct = products[index]
    products.splice(index, 1)
    writeProductsToFile(products)
    console.log('Product deleted:', deletedProduct.name, 'Total products:', products.length)
    notifyProductUpdate()
    return true
  }
  return false
}

export const addOrder = (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
  const orders = readOrdersFromFile()
  const newOrder: Order = {
    ...order,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  orders.push(newOrder)
  writeOrdersToFile(orders)
  return newOrder
}

export const updateOrderStatus = (id: string, status: Order['status']): Order | null => {
  const orders = readOrdersFromFile()
  const order = orders.find(o => o.id === id)
  if (order) {
    order.status = status
    order.updatedAt = new Date()
    writeOrdersToFile(orders)
    return order
  }
  return null
}

// Note: For persistent storage, always use getProducts() and getOrders() functions
// instead of the old products and orders arrays