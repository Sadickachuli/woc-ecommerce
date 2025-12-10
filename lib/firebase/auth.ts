import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth'
import { auth } from './config'

const googleProvider = new GoogleAuthProvider()

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  } catch (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }
}

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth)
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser
}

// Listen to auth state changes
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}


