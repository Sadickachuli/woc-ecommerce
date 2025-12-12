'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, onAuthChange, signInWithGoogle } from '@/lib/firebase/auth'
import { createStore, getStoreByOwner, Store } from '@/lib/firebase/firestore'
import { User as FirebaseUser } from 'firebase/auth'
import toast from 'react-hot-toast'

export default function BecomeSellerPage() {
  const router = useRouter()
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [existingStore, setExistingStore] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    storeName: '',
    contactEmail: '',
    productInfo: '',
    socialMediaLinks: ''
  })

  useEffect(() => {
    const unsubscribe = onAuthChange(async (currentUser) => {
      setUser(currentUser)
      
      if (currentUser) {
        // Check if user already has a store application
        const store = await getStoreByOwner(currentUser.uid)
        if (store) {
          setExistingStore(store)
        }
        setFormData(prev => ({
          ...prev,
          contactEmail: currentUser.email || ''
        }))
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
      toast.success('Signed in successfully!')
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error('Failed to sign in')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please sign in first')
      return
    }

    if (!formData.storeName || !formData.contactEmail || !formData.productInfo) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)

    try {
      await createStore({
        ownerUid: user.uid,
        storeName: formData.storeName,
        contactEmail: formData.contactEmail,
        status: 'pending',
        applicationDetails: {
          productInfo: formData.productInfo,
          socialMediaLinks: formData.socialMediaLinks,
          sampleImages: []
        },
        createdAt: new Date() as any
      })

      setSubmitted(true)
      
      toast.success('Application submitted successfully! Check your email (including spam folder) for verification.', {
        duration: 6000,
        icon: '🎉',
      })
      
      // Redirect to dashboard after showing success message
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 5000)
    } catch (error) {
      console.error('Error submitting application:', error)
      toast.error('Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Become a Seller
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to submit your seller application
            </p>
          </div>
          <button
            onClick={handleSignIn}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                🎉 Application Submitted!
              </h2>
              <p className="text-gray-600 text-lg">
                Thank you for applying to become a seller
              </p>
            </div>

            {/* Spam Warning - Prominent */}
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-5 mb-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-yellow-800 mb-2">
                    📧 Important: Check Your Spam/Junk Folder!
                  </h3>
                  <p className="text-sm text-yellow-700 leading-relaxed mb-2">
                    Once your application is reviewed and approved, we'll send you a <strong>verification email</strong>. 
                    This email may land in your <strong>spam or junk folder</strong>.
                  </p>
                  <p className="text-sm text-yellow-700 leading-relaxed">
                    Please check your spam folder regularly and <strong>mark our emails as "Not Spam"</strong> to ensure 
                    you receive all important notifications about your store, including order alerts.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">
                📋 What Happens Next?
              </h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 mt-1">1️⃣</span>
                  <span>Our team will review your application (usually within 24-48 hours)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 mt-1">2️⃣</span>
                  <span>You'll receive a verification email once approved</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 mt-1">3️⃣</span>
                  <span>Access your seller dashboard to start adding products</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 mt-1">4️⃣</span>
                  <span>Customize your store and start selling!</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Redirecting to your dashboard in a moment...
              </p>
              <div className="animate-pulse">
                <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full animate-[loading_5s_ease-in-out]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (existingStore) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Application Status
            </h2>
            
            {existingStore.status === 'pending' && (
              <>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    ⏳ Under Review
                  </h3>
                  <p className="text-yellow-700 mb-3">
                    Your seller application for <strong>{existingStore.storeName}</strong> is currently under review. 
                    We'll notify you via email once it's been processed.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-sm text-blue-800">
                    <strong>📧 Remember:</strong> Check your <strong>spam/junk folder</strong> for the verification email!
                  </p>
                </div>
              </>
            )}
            
            {existingStore.status === 'verified' && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  You're Already a Seller! ✨
                </h3>
                <p className="text-green-700 mb-4">
                  Your store <strong>{existingStore.storeName}</strong> is verified and active.
                  You don't need to apply again. Use the "Sign In" option to access your dashboard.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push('/admin/dashboard')}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 font-medium"
                  >
                    Go to Your Dashboard
                  </button>
                  <a
                    href={`/store/${existingStore.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-2 px-4 border border-green-600 text-green-600 rounded-md hover:bg-green-50"
                  >
                    View Your Store Page
                  </a>
                </div>
              </div>
            )}
            
            {existingStore.status === 'rejected' && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Application Rejected
                </h3>
                <p className="text-red-700">
                  Unfortunately, your application was not approved. Please contact support for more information.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Apply to Become a Seller
            </h1>
            <p className="text-gray-600">
              Fill out the form below to submit your seller application. We'll review it and get back to you soon!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
                Store Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="storeName"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your store name"
              />
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="contactEmail"
                required
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="productInfo" className="block text-sm font-medium text-gray-700 mb-2">
                Product Details <span className="text-red-500">*</span>
              </label>
              <textarea
                id="productInfo"
                required
                rows={5}
                value={formData.productInfo}
                onChange={(e) => setFormData({ ...formData, productInfo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the products you plan to sell (e.g., handmade jewelry, organic food products, etc.)"
              />
              <p className="mt-1 text-sm text-gray-500">
                Please provide detailed information about what you plan to sell
              </p>
            </div>

            <div>
              <label htmlFor="socialMediaLinks" className="block text-sm font-medium text-gray-700 mb-2">
                Social Media Links
              </label>
              <textarea
                id="socialMediaLinks"
                rows={3}
                value={formData.socialMediaLinks}
                onChange={(e) => setFormData({ ...formData, socialMediaLinks: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Instagram: @yourstore&#10;Facebook: facebook.com/yourstore&#10;Website: www.yourstore.com"
              />
              <p className="mt-1 text-sm text-gray-500">
                Add your social media profiles or website (optional)
              </p>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


