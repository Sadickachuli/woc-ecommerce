// This file is now deprecated in favor of database operations
// Re-export database operations for backward compatibility

export {
  getAllProducts as getProducts,
  createProduct as addProduct,
  updateProduct,
  deleteProduct,
  getAllOrders as getOrders,
  createOrder as addOrder,
  updateOrderStatus,
} from '../../lib/db/operations'

export type { Product, Order } from '../../lib/db/index'

// Callback system for product updates (keeping for compatibility)
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

export const notifyProductUpdate = () => {
  productUpdateCallbacks.forEach(callback => callback())
}

// Export/import functionality (for backup purposes)
export const exportData = async () => {
  const { getAllProducts, getAllOrders } = await import('../../lib/db/operations')
  
  const products = await getAllProducts()
  const orders = await getAllOrders()
  
  return {
    products,
    orders,
    timestamp: new Date().toISOString(),
    version: '3.0'
  }
}

export const importData = async (data: any) => {
  const { createProduct, createOrder } = await import('../../lib/db/operations')
  
  if (data.products && Array.isArray(data.products)) {
    for (const product of data.products) {
      try {
        await createProduct({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          image: product.image,
          category: product.category,
          stock: product.stock,
        })
      } catch (error) {
        console.error('Error importing product:', error)
      }
    }
  }
  
  notifyProductUpdate()
}