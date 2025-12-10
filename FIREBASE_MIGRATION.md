# Firebase Migration & Seller Verification Workflow

This document explains the complete Firebase migration and the new seller application & verification workflow implemented in this e-commerce platform.

## Overview

The application has been successfully migrated from Drizzle/PostgreSQL to Firebase (Authentication + Firestore) with a comprehensive seller verification system.

## What Was Changed

### 1. Database Migration
- **Removed:** Drizzle ORM, PostgreSQL, Vercel KV
- **Added:** Firebase Authentication & Firestore
- **Deleted:** `lib/db/`, `drizzle/`, `drizzle.config.ts`

### 2. New File Structure

```
lib/firebase/
  ├── config.ts           # Firebase initialization
  ├── auth.ts            # Authentication helpers (Google Sign-In)
  └── firestore.ts       # Database operations & type definitions

app/
  ├── become-seller/
  │   └── page.tsx       # Seller application form
  ├── store/
  │   └── [storeId]/
  │       └── page.tsx   # Individual store page
  └── api/
      └── admin/
          └── verify-store/
              └── route.ts  # Store verification API
```

## Firebase Setup Instructions

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Google Analytics (optional)

### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Google** as a sign-in provider
4. Add your domain to authorized domains

### Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose **Production mode** (we'll set up rules later)
4. Select your preferred region

### Step 4: Set Up Firestore Security Rules

Replace the default rules with these:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Stores collection
    match /stores/{storeId} {
      allow read: if true; // Public read for verified stores
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.ownerUid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true; // Public read
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == get(/databases/$(database)/documents/stores/$(resource.data.storeId)).data.ownerUid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if request.auth != null;
      allow create: if true; // Allow anyone to create orders
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Step 5: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the **Web** icon (`</>`)
4. Register your app with a nickname
5. Copy the configuration object

### Step 6: Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Resend API Key (for email notifications)
RESEND_API_KEY=your_resend_api_key_here

# Optional: Admin email for order notifications
ADMIN_EMAIL=your_admin_email@example.com

# Optional: App URL for email links
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 7: Create Your First Admin User

Since there's no admin user initially, you need to manually create one in Firestore:

1. Sign in to your app using Google Sign-In
2. Go to Firebase Console → Firestore Database
3. Find the `users` collection
4. Locate your user document (or create one if it doesn't exist)
5. Set the following fields:
   ```json
   {
     "uid": "your_firebase_uid",
     "email": "your_email@example.com",
     "displayName": "Your Name",
     "role": "admin"
   }
   ```

## Data Models

### Users Collection

```typescript
{
  uid: string
  email: string
  displayName: string
  role: 'admin' | 'seller' | 'user'
  storeId?: string  // Only for sellers
}
```

### Stores Collection

```typescript
{
  id: string (auto-generated)
  ownerUid: string
  storeName: string
  status: 'pending' | 'verified' | 'rejected'
  contactEmail: string
  applicationDetails: {
    productInfo: string
    socialMediaLinks: string
    sampleImages?: string[]
  }
  createdAt: Timestamp
}
```

### Products Collection

```typescript
{
  id: string (auto-generated)
  storeId: string
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
  createdAt: Timestamp
}
```

### Orders Collection

```typescript
{
  id: string (auto-generated)
  customerName: string
  customerEmail: string
  customerPhone?: string
  customerAddress: string
  items: Array<{
    productId: string
    storeId: string
    productName: string
    price: number
    quantity: number
  }>
  total: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  createdAt: Timestamp
}
```

## Seller Application & Verification Workflow

### 1. User Applies to Become a Seller

**URL:** `/become-seller`

**Process:**
1. User signs in with Google
2. Fills out the application form:
   - Store Name
   - Contact Email
   - Product Details (description of products they plan to sell)
   - Social Media Links
3. Submits the application
4. A new document is created in the `stores` collection with `status: 'pending'`

### 2. Admin Reviews Applications

**URL:** `/admin/dashboard` (Pending Sellers tab)

**Process:**
1. Admin signs in
2. Navigates to "Pending Sellers" tab
3. Views list of all pending applications
4. Clicks on an application to see:
   - Store Name
   - Contact Email
   - Product Details
   - Social Media Links
5. Evaluates the application

### 3. Admin Verifies Store

**Action:** Click "Verify Store" button

**Backend Process (`/api/admin/verify-store`):**
1. Updates store status to `'verified'` in Firestore
2. Updates user role to `'seller'` with `storeId`
3. Sends verification email via Resend to seller's contact email

**Email Content:**
- Subject: "Your Store has been Verified! 🎉"
- Includes: Store name, next steps, dashboard link
- Styled with HTML template

### 4. Seller Manages Products

**URL:** `/admin/dashboard`

**Seller View:**
- If status is `pending`: Shows "Application Under Review" message
- If status is `verified`: Shows product management dashboard
  - Add new products
  - Edit existing products
  - Delete products
  - View orders for their store

### 5. Public Storefront

**URL:** `/store/[storeId]`

**Features:**
- Displays store information
- Shows store's product catalog
- Only accessible for stores with `status === 'verified'`
- Shows store description and social media links

**Homepage & Products Page:**
- Only displays products from verified stores
- Uses `getProductsFromVerifiedStores()` function

## Email Notifications

### Store Verification Email
Sent to: Seller's contact email
Trigger: When admin verifies a store
Template: Professional HTML email with call-to-action

### Order Notification Emails
1. **Store Owner Email:** Notifies each store owner about items from their store
2. **Admin Email:** Notifies main admin about all orders
3. **Customer Email:** Order confirmation with all items and total

## API Routes

### `/api/products`
- **GET:** Fetch all products from verified stores
- **POST:** Create a new product (requires storeId)
- **PUT:** Update a product
- **DELETE:** Delete a product

### `/api/orders`
- **GET:** Fetch all orders (admin only)
- **POST:** Create a new order
  - Automatically gets storeId from products
  - Sends notifications to relevant store owners

### `/api/admin/verify-store`
- **POST:** Verify a pending store application
  - Updates store status
  - Updates user role
  - Sends verification email

### `/api/contact`
- **POST:** Send contact form submission (unchanged)

## Testing the Workflow

### 1. Test Seller Application
```bash
1. Go to /become-seller
2. Sign in with Google
3. Fill out the application form
4. Submit
5. Verify document created in Firestore stores collection
```

### 2. Test Admin Verification
```bash
1. Make sure you have admin role in users collection
2. Go to /admin/dashboard
3. Click "Pending Sellers" tab
4. Click on an application
5. Click "Verify Store"
6. Check email inbox for verification email
7. Verify store status updated to 'verified' in Firestore
```

### 3. Test Seller Dashboard
```bash
1. Sign in as verified seller
2. Go to /admin/dashboard
3. Add a product
4. Edit a product
5. Delete a product
6. Verify changes in Firestore
```

### 4. Test Public Store Page
```bash
1. Get a storeId from Firestore
2. Go to /store/[storeId]
3. Verify store information displays
4. Verify products display
5. Test adding products to cart
```

## Migration Checklist

- [x] Uninstall old database dependencies
- [x] Delete old database files
- [x] Install Firebase SDK
- [x] Create Firebase configuration
- [x] Create authentication helpers
- [x] Create Firestore helpers with type definitions
- [x] Refactor API routes to use Firebase
- [x] Create seller application page
- [x] Create admin verification dashboard
- [x] Create verification API route with email
- [x] Update public pages to show verified stores only
- [x] Create store-specific page
- [x] Update order notifications for multi-seller support

## Troubleshooting

### Authentication Issues
- Ensure your domain is added to Firebase authorized domains
- Check that `.env.local` has correct Firebase config
- Clear browser cache and cookies

### Firestore Permission Errors
- Verify security rules are properly configured
- Check user roles in Firestore
- Ensure user is authenticated

### Email Not Sending
- Verify Resend API key is correct
- Check Resend dashboard for error logs
- Ensure email format is valid

### Products Not Showing
- Verify store status is 'verified'
- Check products have correct storeId
- Ensure products are in Firestore

## Next Steps

1. **Add Firebase Storage:** For product image uploads
2. **Implement Order Management:** Allow sellers to update order status
3. **Add Analytics:** Track store performance
4. **Implement Seller Dashboard Stats:** Show revenue, orders, etc.
5. **Add Product Reviews:** Allow customers to review products
6. **Implement Search:** Full-text search for products and stores

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check Firebase Console logs
3. Verify environment variables are set correctly
4. Review Firestore security rules

## License

This project is part of Wings of Change E-commerce platform.


