# 🚀 Setup Instructions - First Time Setup

## You're seeing the old page because Firebase isn't configured yet!

Follow these steps to get Google Sign-In working:

## Step 1: Create Firebase Project (2 minutes)

1. Go to https://console.firebase.google.com/
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "woc-ecommerce")
4. Click Continue
5. Disable Google Analytics (optional) or leave it enabled
6. Click **"Create project"**
7. Wait for it to finish, then click **"Continue"**

## Step 2: Enable Google Authentication (1 minute)

1. In the left sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Click on **"Google"** in the sign-in providers list
4. Toggle the **Enable** switch ON
5. Enter your project support email (your email)
6. Click **"Save"**

## Step 3: Create Firestore Database (1 minute)

1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Click **"Next"**
5. Choose your location (closest to you)
6. Click **"Enable"**

## Step 4: Set Firestore Security Rules (1 minute)

1. In Firestore Database, click on the **"Rules"** tab
2. Replace ALL the content with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Stores collection
    match /stores/{storeId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if request.auth != null;
      allow create: if true;
      allow update: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

## Step 5: Get Your Firebase Config (2 minutes)

1. In the Firebase Console, click the **⚙️ gear icon** (Project Settings)
2. Scroll down to **"Your apps"** section
3. Click the **Web icon** (`</>`) to add a web app
4. Enter an app nickname (e.g., "woc-web")
5. Click **"Register app"**
6. You'll see a `firebaseConfig` object - **COPY THIS!**

It looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Step 6: Create .env.local File (1 minute)

1. In your project root folder, create a new file called `.env.local`
2. Copy the values from Firebase and paste them like this:

```bash
# Firebase Configuration (from Step 5)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...your_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Resend API Key (you already have this)
RESEND_API_KEY=re_...your_resend_key

# Optional
ADMIN_EMAIL=wingsofchangeghana@gmail.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

⚠️ **IMPORTANT:** Make sure there are NO quotes around the values!

## Step 7: Restart Your Dev Server

```bash
# Stop your current server (Ctrl+C)
# Then start it again:
npm run dev
```

## Step 8: Sign In and Set Admin Role (2 minutes)

1. Go to http://localhost:3000/admin
2. Click **"Sign in with Google"**
3. Choose your Google account
4. You'll see a message saying you don't have admin access yet
5. Go back to Firebase Console
6. Click **"Firestore Database"** in the left sidebar
7. You should see a `users` collection with your user document
8. Click on your user document
9. Click the **"pencil/edit"** icon
10. Find the `role` field and change it from `"user"` to `"admin"` (keep the quotes!)
11. Click **"Update"**
12. Go back to your app and click **"Refresh Page"**
13. 🎉 You should now be redirected to the admin dashboard!

## Verification

✅ You'll know it's working when:
- You see the "Sign in with Google" button at `/admin`
- You can click it and see the Google Sign-In popup
- After signing in and setting your role, you're redirected to the dashboard

## Troubleshooting

### "Nothing is showing" or "Still looks old"
- Make sure you created `.env.local` file
- Make sure you restarted your dev server after creating `.env.local`
- Clear your browser cache (Ctrl+Shift+Delete)

### "Sign in with Google" button does nothing
- Check browser console (F12) for errors
- Make sure Google Sign-In is enabled in Firebase Console
- Make sure your domain is authorized in Firebase

### "Permission denied" errors
- Check that Firestore security rules are published
- Make sure you're signed in
- Check that your user document has the correct role

### Can't find my user in Firestore
- Try signing in first at `/admin`
- The user document is created automatically on first sign-in
- Check the `users` collection in Firestore

## What's Next?

After you can sign in as admin:
1. ✅ Go to `/admin/dashboard` - you'll see the admin panel
2. ✅ Test becoming a seller at `/become-seller` (with a different Google account)
3. ✅ Verify the seller application as admin
4. ✅ Add products as a verified seller
5. ✅ View the store page at `/store/[storeId]`

## Need Help?

Check these files:
- `FIREBASE_MIGRATION.md` - Complete technical docs
- `QUICK_START.md` - Quick start guide
- `.env.local.example` - Example environment variables

---

**Remember:** The app MUST have Firebase configured to work. The old PostgreSQL database has been completely removed.


