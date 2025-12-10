# Wings of Change Ecommerce Platform

A modern, multi-seller ecommerce marketplace built for Wings of Change organization to showcase and sell innovative products from Ghana's brightest minds.

## 🚀 NEW: Firebase Migration Complete!

This platform has been completely refactored to use Firebase with a comprehensive seller application and verification workflow.

### ⚠️ IMPORTANT: First Time Setup Required

**If you're seeing nothing or the old page, you need to set up Firebase first!**

👉 **START HERE:** Read `WHY_YOU_SEE_NOTHING.md` then follow `CHECKLIST.md`

## 📚 Documentation

- **`WHY_YOU_SEE_NOTHING.md`** - Why the app isn't working yet
- **`CHECKLIST.md`** - Quick setup checklist (7 minutes)
- **`SETUP_INSTRUCTIONS.md`** - Detailed step-by-step guide
- **`FIREBASE_MIGRATION.md`** - Complete technical documentation
- **`QUICK_START.md`** - Quick overview of features

## ✨ Features

### 🛍️ Customer Features
- Browse products from verified sellers
- Search and filter by category
- View individual store pages
- Shopping cart with checkout
- Order confirmation emails
- Responsive design (mobile, tablet, desktop)

### 👥 Seller Features
- Apply to become a seller
- Wait for admin verification
- Manage products after approval
- Receive order notifications
- Individual store page with branding

### 🔐 Admin Features
- Google Sign-In authentication
- Review seller applications
- Verify/reject stores
- Automated verification emails
- Manage all products and orders
- View platform statistics

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google Sign-In)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Email**: Resend



## 📁 Project Structure

```
woc-ecommerce/
├── app/
│   ├── admin/
│   │   ├── page.tsx              # Google Sign-In page
│   │   └── dashboard/page.tsx    # Admin/Seller dashboard
│   ├── become-seller/
│   │   └── page.tsx              # Seller application form
│   ├── store/
│   │   └── [storeId]/page.tsx    # Individual store pages
│   ├── api/
│   │   ├── admin/
│   │   │   └── verify-store/     # Store verification endpoint
│   │   ├── orders/               # Order management
│   │   ├── products/             # Product management
│   │   └── contact/              # Contact form
│   ├── components/               # Reusable UI components
│   ├── contexts/                 # React contexts
│   └── lib/
│       └── data.ts               # Compatibility layer
├── lib/
│   └── firebase/
│       ├── config.ts             # Firebase initialization
│       ├── auth.ts               # Authentication helpers
│       └── firestore.ts          # Database operations
├── public/                       # Static assets
├── .env.local.example            # Environment variables template
├── CHECKLIST.md                  # Setup checklist
├── SETUP_INSTRUCTIONS.md         # Detailed setup guide
├── FIREBASE_MIGRATION.md         # Technical documentation
├── QUICK_START.md                # Quick overview
└── WHY_YOU_SEE_NOTHING.md        # Troubleshooting guide
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Firebase (Required!)

Follow the checklist in `CHECKLIST.md` or detailed guide in `SETUP_INSTRUCTIONS.md`:

1. Create Firebase project
2. Enable Google Authentication
3. Create Firestore database
4. Set security rules
5. Get Firebase config
6. Create `.env.local` file
7. Restart dev server

### 3. Run Development Server

```bash
npm run dev
```

### 4. Set Your Admin Role

1. Sign in at http://localhost:3000/admin
2. Go to Firebase Console → Firestore → users
3. Set your `role` to `"admin"`
4. Refresh the page

## 🎯 User Roles

- **admin**: Can verify stores, manage all products, view all orders
- **seller**: Can manage own store products (after verification)
- **user**: Can browse and purchase (default)

## 🔄 Seller Workflow

1. **Apply**: User applies at `/become-seller`
2. **Review**: Admin reviews application at `/admin/dashboard`
3. **Verify**: Admin clicks "Verify Store"
4. **Email**: Seller receives verification email
5. **Manage**: Seller can now add/edit products
6. **Public**: Store appears at `/store/[storeId]`

## 📧 Email Notifications

Emails are sent for:
- ✅ Store verification (to seller)
- ✅ New orders (to store owners and admin)
- ✅ Order confirmation (to customers)

## 🌐 Environment Variables

Required in `.env.local`:

```bash
# Firebase (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Resend (Required for emails)
RESEND_API_KEY=

# Optional
ADMIN_EMAIL=
NEXT_PUBLIC_APP_URL=
```



## License

This project is created for Wings of Change organization.

## Support

For support or questions, contact the development team or Wings of Change organization.

---

**Built with ❤️ for Wings of Change - Supporting Innovation in Ghana** 
