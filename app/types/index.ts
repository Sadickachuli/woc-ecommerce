export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  total: number
}

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface AdminCredentials {
  email: string
  password: string
} 