// This file provides compatibility layer for existing code
// Now using Firebase instead of PostgreSQL

import { 
  getAllProducts,
  getProductsFromVerifiedStores,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  createOrder,
  updateOrderStatus,
  Product,
  Order
} from '@/lib/firebase/firestore'

// Re-export Firebase operations for backward compatibility
export const getProducts = async () => {
  // For public view, only show products from verified stores
  return await getProductsFromVerifiedStores()
}

export const addProduct = createProduct
export { updateProduct, deleteProduct }

export const getOrders = getAllOrders
export const addOrder = createOrder
export { updateOrderStatus }

export type { Product, Order }

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
  const products = await getAllProducts()
  const orders = await getAllOrders()
  
  return {
    products,
    orders,
    timestamp: new Date().toISOString(),
    version: '4.0-firebase'
  }
}

export const importData = async (data: any) => {
  // Note: Import functionality needs to be updated with storeId
  // This is kept for backward compatibility but will need proper implementation
  console.warn('Import functionality needs to be updated to include storeId')
  
  if (data.products && Array.isArray(data.products)) {
    for (const product of data.products) {
      try {
        // Note: This will fail without a valid storeId
        if (product.storeId) {
          await createProduct({
            storeId: product.storeId,
            name: product.name,
            description: product.description,
            price: typeof product.price === 'number' ? product.price : parseFloat(product.price),
            image: product.image,
            category: product.category,
            stock: product.stock,
          })
        }
      } catch (error) {
        console.error('Error importing product:', error)
      }
    }
  }
  
  notifyProductUpdate()
}
