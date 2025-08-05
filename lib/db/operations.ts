import { eq, desc } from 'drizzle-orm'
import { db } from './index'
import { products, orders, orderItems } from './schema'
import type { NewProduct, NewOrder, NewOrderItem, Product, Order } from './schema'

// Product operations
export async function getAllProducts(): Promise<any[]> {
  try {
    const dbProducts = await db.select().from(products).orderBy(desc(products.createdAt))
    // Convert price from string to number for frontend compatibility
    return dbProducts.map(product => ({
      ...product,
      price: parseFloat(product.price)
    }))
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function getProductById(id: string): Promise<any | null> {
  try {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1)
    const product = result[0]
    if (product) {
      return {
        ...product,
        price: parseFloat(product.price)
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function createProduct(productData: Omit<NewProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<any | null> {
  try {
    console.log('Database createProduct called with:', productData)
    
    const newProduct: NewProduct = {
      id: Date.now().toString(),
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    console.log('Inserting product into database:', newProduct)
    
    const result = await db.insert(products).values(newProduct).returning()
    console.log('Database insert result:', result)
    
    const product = result[0]
    if (product) {
      const convertedProduct = {
        ...product,
        price: parseFloat(product.price)
      }
      console.log('Product created successfully:', convertedProduct)
      return convertedProduct
    }
    
    console.error('No product returned from database insert')
    return null
  } catch (error) {
    console.error('Error creating product in database:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return null
  }
}

export async function updateProduct(id: string, updates: Partial<Omit<NewProduct, 'id' | 'createdAt'>>): Promise<any | null> {
  try {
    const result = await db
      .update(products)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning()
    
    const product = result[0]
    if (product) {
      return {
        ...product,
        price: parseFloat(product.price)
      }
    }
    return null
  } catch (error) {
    console.error('Error updating product:', error)
    return null
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const result = await db.delete(products).where(eq(products.id, id)).returning()
    return result.length > 0
  } catch (error) {
    console.error('Error deleting product:', error)
    return false
  }
}

// Order operations
export async function getAllOrders(): Promise<any[]> {
  try {
    const ordersResult = await db.select().from(orders).orderBy(desc(orders.createdAt))
    
    // Get order items for each order and convert types
    const ordersWithItems = await Promise.all(
      ordersResult.map(async (order) => {
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id))
        const convertedItems = items.map(item => ({
          ...item,
          price: parseFloat(item.price)
        }))
        
        return { 
          ...order, 
          total: parseFloat(order.total),
          items: convertedItems 
        }
      })
    )
    
    return ordersWithItems
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}

export async function createOrder(orderData: {
  customer: {
    name: string
    email: string
    phone?: string
    address: string
  }
  items: Array<{
    productId: string
    productName: string
    price: number
    quantity: number
  }>
  total: number
}): Promise<any | null> {
  try {
    // Create order
    const newOrder: NewOrder = {
      id: Date.now().toString(),
      customerName: orderData.customer.name,
      customerEmail: orderData.customer.email,
      customerPhone: orderData.customer.phone || null,
      customerAddress: orderData.customer.address,
      total: orderData.total.toString(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    const orderResult = await db.insert(orders).values(newOrder).returning()
    const createdOrder = orderResult[0]
    
    if (!createdOrder) {
      throw new Error('Failed to create order')
    }
    
    // Create order items
    const orderItemsData: NewOrderItem[] = orderData.items.map((item) => ({
      id: `${createdOrder.id}-${item.productId}-${Date.now()}`,
      orderId: createdOrder.id,
      productId: item.productId,
      productName: item.productName,
      price: item.price.toString(),
      quantity: item.quantity,
      createdAt: new Date(),
    }))
    
    await db.insert(orderItems).values(orderItemsData)
    
    // Convert total to number for frontend compatibility
    return {
      ...createdOrder,
      total: parseFloat(createdOrder.total)
    }
  } catch (error) {
    console.error('Error creating order:', error)
    return null
  }
}

export async function updateOrderStatus(id: string, status: string): Promise<any | null> {
  try {
    const result = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning()
    
    const order = result[0]
    if (order) {
      return {
        ...order,
        total: parseFloat(order.total)
      }
    }
    return null
  } catch (error) {
    console.error('Error updating order status:', error)
    return null
  }
}

// Initialize database with default products (only run once)
let databaseInitialized = false

export async function initializeDatabase(): Promise<void> {
  try {
    // Skip if already initialized in this session
    if (databaseInitialized) {
      return
    }
    
    // Check if products already exist
    const existingProducts = await getAllProducts()
    
    if (existingProducts.length === 0) {
      console.log('Initializing database with default products...')
      
      const defaultProducts = [
        {
          name: 'Innovative Solar Charger',
          description: 'A portable solar charger designed for rural communities in Ghana. Provides reliable power for mobile devices and small appliances.',
          price: '299.99',
          image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=400&fit=crop',
          category: 'Technology',
          stock: 50,
        },
        {
          name: 'Organic Shea Butter Cream',
          description: 'Handcrafted shea butter cream made from locally sourced ingredients. Perfect for skin care and hair treatment.',
          price: '24.99',
          image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
          category: 'Beauty',
          stock: 100,
        },
        {
          name: 'Recycled Plastic Bags',
          description: 'Eco-friendly bags made from recycled plastic materials. Durable and stylish for everyday use.',
          price: '15.99',
          image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400&h=400&fit=crop',
          category: 'Fashion',
          stock: 75,
        },
        {
          name: 'Traditional Bead Jewelry',
          description: 'Handmade traditional bead jewelry crafted by local artisans. Each piece tells a unique story.',
          price: '45.99',
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
          category: 'Jewelry',
          stock: 30,
        },
        {
          name: 'Local Honey',
          description: 'Pure, natural honey harvested from local beekeepers. Rich in flavor and health benefits.',
          price: '12.99',
          image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop',
          category: 'Food',
          stock: 60,
        },
        {
          name: 'Bamboo Water Bottle',
          description: 'Sustainable bamboo water bottle with natural antibacterial properties. Perfect for eco-conscious consumers.',
          price: '19.99',
          image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
          category: 'Lifestyle',
          stock: 40,
        },
      ]
      
      for (const product of defaultProducts) {
        await createProduct(product)
      }
      
      console.log('Database initialized with default products!')
    }
    
    // Mark as initialized to prevent re-initialization
    databaseInitialized = true
  } catch (error) {
    console.error('Error initializing database:', error)
  }
}