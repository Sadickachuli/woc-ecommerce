import type { Product } from '@/lib/firebase/firestore'

// Re-export all types from Firestore
export type { Product, Order, OrderItem, User, Store } from '@/lib/firebase/firestore'

// Additional types for the app
export interface CartItem {
  product: Product
  quantity: number
}

export interface AdminCredentials {
  email: string
  password: string
}
