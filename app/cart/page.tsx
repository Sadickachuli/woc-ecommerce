'use client'

import { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/currencies'

export default function CartPage() {
  const { state, removeItem, updateQuantity, clearCart } = useCart()
  const router = useRouter()

  // Check if cart has mixed currencies
  const currencies = [...new Set(state.items.map(item => item.currency || 'USD'))]
  const hasMixedCurrencies = currencies.length > 1
  const mainCurrency = currencies[0] || 'USD'

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleCheckout = () => {
    if (state.items.length === 0) {
      return
    }
    router.push('/checkout')
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <ShoppingCart className="w-14 h-14 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-8 px-4">Looks like you haven't added any items to your cart yet.</p>
            <Link
              href="/products"
              className="bg-primary-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors inline-flex items-center gap-2 text-sm sm:text-base"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                  Cart Items ({state.items.length})
                </h2>
                
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <div key={item.product.id!} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex gap-4">
                        {/* Product Image - Larger on mobile, fixed on desktop */}
                        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-24 md:h-24 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                          {item.product.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-gray-500 font-bold text-2xl sm:text-3xl md:text-2xl">
                              {item.product.name.charAt(0)}
                            </span>
                          )}
                        </div>

                        {/* Product Info & Controls */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          {/* Product Details */}
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 text-base sm:text-lg truncate">{item.product.name}</h3>
                            <p className="text-sm text-gray-500 mt-0.5">{item.product.category}</p>
                            <p className="text-lg sm:text-xl font-semibold text-primary-600 mt-1">
                              {formatPrice(item.product.price, item.currency)}
                            </p>
                          </div>

                          {/* Quantity Controls & Remove Button */}
                          <div className="flex items-center justify-between mt-3 gap-2">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <button
                                onClick={() => handleQuantityChange(item.product.id!, item.quantity - 1)}
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
                              >
                                <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                              <span className="w-10 sm:w-12 text-center font-semibold text-base sm:text-lg">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item.product.id!, item.quantity + 1)}
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
                              >
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                            </div>

                            {/* Remove Button - More prominent on mobile */}
                            <button
                              onClick={() => removeItem(item.product.id!)}
                              className="text-red-500 hover:text-red-700 active:text-red-800 p-2 -mr-2"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clear Cart Button */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 sticky top-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {hasMixedCurrencies ? (
                      <span className="text-sm">Mixed currencies</span>
                    ) : (
                      formatPrice(state.total, mainCurrency)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                {hasMixedCurrencies && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2">
                    <p className="text-xs text-yellow-800">
                      ⚠️ Your cart contains items in different currencies. Prices shown in their respective currencies.
                    </p>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold text-primary-600">
                      {hasMixedCurrencies ? (
                        <span className="text-sm">See items above</span>
                      ) : (
                        formatPrice(state.total, mainCurrency)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-4 text-center">
                <Link
                  href="/products"
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}