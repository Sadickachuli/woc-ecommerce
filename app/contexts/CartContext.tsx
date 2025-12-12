'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import { Product } from '../types'
import toast from 'react-hot-toast'

interface CartItem {
  product: Product
  quantity: number
  currency?: string // Store's currency for this product
}

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; currency?: string } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }

const CartContext = createContext<{
  state: CartState
  addItem: (product: Product, currency?: string) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
} | null>(null)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, currency } = action.payload
      const existingItem = state.items.find(item => item.product.id === product.id!)
      
      if (existingItem) {
        // Update quantity if item already exists
        const updatedItems = state.items.map(item =>
          item.product.id === product.id!
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        }
      } else {
        // Check if cart has items from a different store
        if (state.items.length > 0) {
          const firstItemStoreId = state.items[0].product.storeId
          const newItemStoreId = product.storeId
          
          if (firstItemStoreId !== newItemStoreId) {
            // Different store - clear cart and replace with new item
            const newItems = [{ product, quantity: 1, currency }]
            return {
              items: newItems,
              total: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
            }
          }
        }
        
        // Add new item with currency (same store or empty cart)
        const newItems = [...state.items, { product, quantity: 1, currency }]
        return {
          ...state,
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        }
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.product.id! !== action.payload)
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      }
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.product.id! === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0) // Remove items with quantity 0
      
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      }
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0
      }
    
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0
  })

  const addItem = (product: Product, currency?: string) => {
    // Check if adding from different store
    if (state.items.length > 0) {
      const firstItemStoreId = state.items[0].product.storeId
      const newItemStoreId = product.storeId
      
      if (firstItemStoreId !== newItemStoreId) {
        // Show warning BEFORE clearing cart
        toast((t) => (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1">
                <p className="font-bold text-sm">Different Store Detected</p>
                <p className="text-xs text-gray-600">Previous cart items will be replaced</p>
              </div>
            </div>
            <div className="text-xs bg-blue-50 p-2 rounded border border-blue-200">
              💡 <strong>Tip:</strong> Checkout before shopping from another store
            </div>
          </div>
        ), {
          duration: 5000,
          style: {
            background: '#FEF3C7',
            border: '2px solid #F59E0B',
            padding: '12px',
          },
        })
      }
    }
    
    dispatch({ type: 'ADD_ITEM', payload: { product, currency } })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 