'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithGoogle, onAuthChange } from '@/lib/firebase/auth'
import { getUser, createUser } from '@/lib/firebase/firestore'
import { User as FirebaseUser } from 'firebase/auth'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [loading, setLoading] = useState(true)
  const [signingIn, setSigningIn] = useState(false)
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthChange(async (currentUser) => {
      setUser(currentUser)
      
      if (currentUser) {
        // Check if user exists in Firestore
        let userData = await getUser(currentUser.uid)
        
        if (!userData) {
          // Create user document if it doesn't exist
          userData = {
            uid: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || '',
            role: 'user' // Default role
          }
          
          try {
            await createUser(userData)
            toast.success('Account created! Please contact admin to upgrade your role.')
          } catch (error) {
            console.error('Error creating user:', error)
          }
        }
        
        setUserRole(userData.role)
        
        // Redirect based on role
        if (userData.role === 'admin' || userData.role === 'seller') {
          router.push('/admin/dashboard')
        }
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const handleSignIn = async () => {
    setSigningIn(true)
    try {
      await signInWithGoogle()
      toast.success('Signed in successfully!')
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error('Failed to sign in. Please try again.')
      setSigningIn(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (user && userRole === 'user') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Access Restricted
              </h2>
              <p className="text-gray-600 mb-6">
                Hi {user.displayName || user.email}! Your account doesn't have admin or seller access yet.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-blue-900 mb-2">To get access:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                  <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a></li>
                  <li>Navigate to Firestore Database → <code className="bg-blue-100 px-1 rounded">users</code> collection</li>
                  <li>Find your user document: <code className="bg-blue-100 px-1 rounded text-xs break-all">{user.uid}</code></li>
                  <li>Edit the document and set <code className="bg-blue-100 px-1 rounded">role</code> to <code className="bg-blue-100 px-1 rounded">"admin"</code></li>
                  <li>Save and refresh this page</li>
                </ol>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() => router.push('/become-seller')}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Apply to Become a Seller
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="w-full text-gray-600 py-2 px-4 rounded-lg hover:text-gray-900"
                >
                  Go to Homepage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">WC</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access your dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            {/* Sign In Button */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3 text-center">
                For existing users (Admins & Sellers)
              </p>
              <button
                onClick={handleSignIn}
                disabled={signingIn}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {signingIn ? 'Signing in...' : 'Sign in with Google'}
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New seller?</span>
              </div>
            </div>

            {/* Become a Seller Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Don't have a store yet?
              </p>
              <a
                href="/become-seller"
                className="inline-flex items-center justify-center w-full py-3 px-4 border-2 border-blue-600 rounded-lg text-blue-600 hover:bg-blue-50 font-medium transition-colors"
              >
                Apply to Become a Seller →
              </a>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
              <p className="font-semibold text-blue-900 mb-2">Who should sign in here?</p>
              <ul className="space-y-1 text-blue-800 text-sm">
                <li>✓ <strong>Admins</strong> - Platform administrators</li>
                <li>✓ <strong>Verified Sellers</strong> - Existing store owners</li>
                <li>✗ <strong>New Sellers</strong> - Use "Apply to Become a Seller" instead</li>
                <li>✗ <strong>Customers</strong> - No need to sign in for shopping</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 