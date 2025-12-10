# 👑 Admin Control Panel - Complete Guide

## Overview

Admins now have full platform management capabilities with a dedicated control panel to manage users, products, and stores.

---

## 🎯 What's New

### Admin Features:
1. **User Management**
   - View all users
   - Change user roles (User ↔ Seller ↔ Admin)
   - Delete users

2. **Product Management**
   - View all products across all stores
   - See which store each product belongs to
   - Delete any product from any store

3. **Store Management**
   - View all stores (pending, verified, rejected)
   - Revoke store verification
   - Delete stores (and all their products)

4. **Quick Access**
   - "Manage Platform" button in dashboard header
   - Dedicated management page at `/admin/manage`

---

## 🚀 How to Access

### From Dashboard:
1. Sign in as admin
2. Look for **"Manage Platform"** button (blue button in top right)
3. Click to go to Admin Management page

### Direct URL:
```
http://localhost:3000/admin/manage
```

**Note:** Only accessible to users with `role: "admin"` in Firestore

---

## 📊 Management Interface

### Navigation Tabs:

#### 1. Users Tab
**What you see:**
- Table of all users
- Email address and User ID
- Current role (dropdown to change)
- Delete button (except for admins)

**Actions:**
- **Change Role:** Click the role dropdown and select new role
  - User (default)
  - Seller (can create stores)
  - Admin (full platform control)
- **Delete User:** Click trash icon (⚠️ Cannot delete admins)
  - **Cascade Deletion:** If user is a seller, also deletes their store and all products
- **Refresh:** Reload user list

#### 2. Products Tab
**What you see:**
- Grid of all product cards
- Product image, name, and price
- Store name it belongs to
- Delete button

**Actions:**
- **Delete Product:** Click trash icon on any product
- **Refresh:** Reload product list

**Use Cases:**
- Remove inappropriate products
- Clean up test products
- Moderate product listings

#### 3. Stores Tab
**What you see:**
- List of all stores
- Store name and status badge
- Contact email
- Product count and currency
- Action buttons

**Actions:**
- **Revoke Verification:** ⚠️ Change verified → pending
- **Delete Store:** 🗑️ Remove store + all its products
- **Refresh:** Reload store list

**Status Badges:**
- 🟢 **Verified** (green) - Active store
- 🟡 **Pending** (yellow) - Awaiting approval
- 🔴 **Rejected** (red) - Application denied

---

## ⚙️ Technical Implementation

### New Files:

**`app/admin/manage/page.tsx`**
- Main admin management interface
- Three tabs: Users, Products, Stores
- Real-time data loading
- Confirmation dialogs for destructive actions

### New Functions in `lib/firebase/firestore.ts`:

```typescript
// Get all users
export const getAllUsers = async (): Promise<User[]>

// Delete a user
export const deleteUser = async (userId: string)

// Get all stores
export const getAllStores = async (): Promise<Store[]>

// Delete a store and all its products
export const deleteStore = async (storeId: string)
```

**Existing Functions Used:**
- `getAllProducts()` - Get all products
- `deleteProduct()` - Delete a product
- `updateUserRole()` - Change user role
- `updateStoreStatus()` - Change store status

### Dashboard Updates:

**`app/admin/dashboard/page.tsx`:**
- Added "Manage Platform" button in header (admins only)
- Imports `UserCog` icon from lucide-react
- Links to `/admin/manage`

---

## 🔐 Security

### Role-Based Access:
- **Admin only** - All management features
- **Seller** - Cannot access management page
- **User** - Cannot access management page

### Protection:
```typescript
// In page component
if (userData && userData.role === 'admin') {
  setUserRole(userData.role)
  // Load management data
} else {
  router.push('/admin/dashboard')
}
```

### Firestore Rules:
Currently set to allow all authenticated writes for development. **For production**, tighten security rules:

```javascript
// Example production rules (not implemented yet)
match /users/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && 
               get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

---

## 🧪 Testing Locally

### Test User Management:
1. Sign in as admin
2. Go to "Manage Platform" → "Users" tab
3. Create a test user (sign in with different Google account in incognito)
4. Change their role to "Seller"
5. Verify role changes in Firestore

### Test Product Management:
1. As a seller, create a product
2. As admin, go to "Products" tab
3. Find the product
4. Delete it
5. Verify it's removed from store

### Test Store Management:
1. As admin, go to "Stores" tab
2. Find a verified store
3. Click "Revoke Verification"
4. Verify status changes to "pending"
5. Optionally, delete the store

---

## 📋 User Flows

### Flow 1: Promote User to Seller
```
Admin Dashboard → Manage Platform → Users Tab
  ↓
Find user in table
  ↓
Click role dropdown → Select "Seller"
  ↓
User can now apply to become a seller
```

### Flow 2: Remove Inappropriate Product
```
Admin Dashboard → Manage Platform → Products Tab
  ↓
Browse products grid
  ↓
Click trash icon on product
  ↓
Confirm deletion
  ↓
Product removed from store
```

### Flow 3: Delete Store
```
Admin Dashboard → Manage Platform → Stores Tab
  ↓
Find store in list
  ↓
Click trash icon
  ↓
Confirm deletion (warns about products)
  ↓
Store + all products deleted
```

---

## 🔗 Cascade Deletions

The platform intelligently handles related data when deleting:

### Deleting a Seller User:
```
User (Seller)
  └─ Store (owned by user)
      └─ Products (in store)
```
**Result:** All three are deleted automatically

### Deleting a Store:
```
Store
  └─ Products (in store)
```
**Result:** Both are deleted automatically

### Deleting a Regular User:
```
User (non-seller)
```
**Result:** Only the user is deleted

**Why?** This prevents orphaned data (stores without owners, products without stores) and keeps the database clean.

---

## ⚠️ Confirmation Dialogs

All destructive actions show confirm dialogs:

### Delete User:

**For Regular Users:**
```
Are you sure you want to delete user "email@example.com"? 
This action cannot be undone.
```

**For Sellers:**
```
Are you sure you want to delete user "email@example.com"? 
This will also delete their store and all products. 
This action cannot be undone.
```

### Delete Product:
```
Are you sure you want to delete product "Product Name"? 
This action cannot be undone.
```

### Delete Store:
```
Are you sure you want to delete store "Store Name"? 
This will also delete all products from this store. 
This action cannot be undone.
```

### Revoke Verification:
```
Are you sure you want to revoke verification for "Store Name"?
```

---

## 🎨 UI Elements

### Color Coding:

**Role Badges:**
- 🔴 Admin - Red background
- 🔵 Seller - Blue background
- ⚪ User - Gray background

**Status Badges:**
- 🟢 Verified - Green with checkmark
- 🟡 Pending - Yellow with clock
- 🔴 Rejected - Red with X

**Action Buttons:**
- 🔵 Primary (blue) - Refresh, load data
- 🟡 Warning (yellow) - Revoke verification
- 🔴 Danger (red) - Delete actions

---

## 📊 Statistics Overview

### Users Tab:
```
Users (23)
└─ Total registered users
```

### Products Tab:
```
Products (156)
└─ All products across all stores
```

### Stores Tab:
```
Stores (8)
├─ Verified: 5
├─ Pending: 2
└─ Rejected: 1
```

---

## 💡 Best Practices

### For User Management:
- ✅ Review seller applications before promoting
- ✅ Only delete spam/fake accounts
- ✅ Keep at least one admin account
- ❌ Don't delete admins (protected)

### For Product Management:
- ✅ Remove policy-violating products
- ✅ Clean up test products
- ✅ Notify sellers before deletion (manual)
- ❌ Don't delete without reason

### For Store Management:
- ✅ Revoke verification for policy violations
- ✅ Delete only abandoned/spam stores
- ✅ Be cautious - deletes all products
- ❌ Don't delete active verified stores without reason

---

## 🔮 Future Enhancements (Not Implemented Yet)

Potential additions:
- Bulk actions (delete multiple items)
- Search and filter
- Export data to CSV
- Activity logs
- Email notifications to users
- Soft delete (recoverable)
- User suspension (temporary)
- Product approval workflow

---

## 🐛 Troubleshooting

### "Access Denied"
- Check your role in Firestore `users` collection
- Must be `role: "admin"`
- Sign out and sign back in

### "Failed to load users/products/stores"
- Check Firestore security rules
- Ensure rules allow reads for authenticated users
- Check browser console for errors

### Changes Not Reflecting
- Click the "Refresh" button in each tab
- Check Firestore directly to verify changes
- Clear browser cache

---

## ✅ Summary

### What Admins Can Do:
| Feature | Action | Impact |
|---------|--------|--------|
| **Users** | View all | See platform users |
| | Change role | Grant/revoke seller access |
| | Delete user | Remove user only |
| | Delete seller | Remove user + store + products |
| **Products** | View all | See all listings |
| | Delete product | Remove from store |
| **Stores** | View all | See all stores |
| | Revoke verification | Suspend store |
| | Delete store | Remove store + products |

### Access:
- **Button:** "Manage Platform" in dashboard header
- **URL:** `/admin/manage`
- **Required Role:** Admin

### Safety:
- ✅ Confirmation dialogs
- ✅ Cannot delete admins
- ✅ Clear warnings
- ✅ Role-based access

---

**Admin control panel is ready! Test it locally before deploying!** 🚀

