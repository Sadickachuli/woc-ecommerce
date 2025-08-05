import { eq, desc } from 'drizzle-orm'
import { db } from './index'
import { products, orders, orderItems } from './schema'
import type { NewProduct, NewOrder, NewOrderItem, Product, Order } from './schema'

// Product operations
export async function getAllProducts(): Promise<Product[]> {
  try {
    return await db.select().from(products).orderBy(desc(products.createdAt))
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1)
    return result[0] || null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function createProduct(productData: Omit<NewProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product | null> {
  try {
    const newProduct: NewProduct = {
      id: Date.now().toString(),
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    const result = await db.insert(products).values(newProduct).returning()
    return result[0] || null
  } catch (error) {
    console.error('Error creating product:', error)
    return null
  }
}

export async function updateProduct(id: string, updates: Partial<Omit<NewProduct, 'id' | 'createdAt'>>): Promise<Product | null> {
  try {
    const result = await db
      .update(products)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning()
    
    return result[0] || null
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
export async function getAllOrders(): Promise<(Order & { items: any[] })[]> {
  try {
    const ordersResult = await db.select().from(orders).orderBy(desc(orders.createdAt))
    
    // Get order items for each order
    const ordersWithItems = await Promise.all(
      ordersResult.map(async (order) => {
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id))
        return { ...order, items }
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
}): Promise<Order | null> {
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
    
    return createdOrder
  } catch (error) {
    console.error('Error creating order:', error)
    return null
  }
}

export async function updateOrderStatus(id: string, status: string): Promise<Order | null> {
  try {
    const result = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning()
    
    return result[0] || null
  } catch (error) {
    console.error('Error updating order status:', error)
    return null
  }
}

// Initialize database with default products
export async function initializeDatabase(): Promise<void> {
  try {
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
  } catch (error) {
    console.error('Error initializing database:', error)
  }
}