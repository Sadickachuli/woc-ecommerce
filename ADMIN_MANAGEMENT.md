# 👑 Admin Management Guide

## Overview

This platform has a simple, manual admin management system. There's **one main admin** (you), and you can manually add more admins through Firebase Console when needed.

## 🎯 Admin Roles

| Role | Permissions |
|------|-------------|
| **admin** | Can verify stores, manage all products, view all orders, see all seller applications |
| **seller** | Can manage own store products after verification, receive order notifications |
| **user** | Can browse products, place orders (default for all new signups) |

## 🔐 How to Add an Admin

### Method: Manual via Firebase Console

**Step 1: User Must Sign In First**

1. The person who will be admin must first sign in to the site
2. Go to http://localhost:3000/admin
3. Click "Sign in with Google"
4. Sign in with their Google account
5. This creates their user document in Firestore

**Step 2: Make Them an Admin**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **wingsocecommerce**
3. Go to **Firestore Database**
4. Click on the **`users`** collection
5. Find their user document (search by email or scroll through)
6. Click on their document
7. Find the `role` field
8. Click the **edit icon** (pencil)
9. Change `"user"` to `"admin"` (keep the quotes!)
10. Click **"Update"**
11. Done! ✅

**Step 3: They're Now an Admin**

1. They should refresh their browser
2. Go to http://localhost:3000/admin/dashboard
3. They'll now see the full admin dashboard with:
   - All stores and products
   - Pending seller applications
   - All orders
   - Verification buttons

## 👤 Your Main Admin Account

**Your Current Admin:**
- You set this up during Firebase setup
- Your Google account that you use to sign in
- Has full admin privileges

**Keep This Account Secure:**
- ✅ Use a strong Google account password
- ✅ Enable 2FA on your Google account
- ✅ Don't share your admin credentials

## 📋 Managing Admins

### To View All Admins

1. Go to Firebase Console → **Firestore Database**
2. Click **`users`** collection
3. Look for documents where `role: "admin"`
4. You'll see all admins listed

### To Remove Admin Access

1. Go to Firebase Console → **Firestore Database**
2. Click **`users`** collection
3. Find the user document
4. Change `role` from `"admin"` to `"user"`
5. They'll lose admin access immediately

### To Check Someone's Role

1. Go to Firebase Console → **Firestore Database**
2. Click **`users`** collection
3. Search for their email or UID
4. Check their `role` field:
   - `"admin"` = Full admin access
   - `"seller"` = Verified seller
   - `"user"` = Regular customer

## 🛡️ Security Best Practices

### For Production Deployment:

1. **Limit Admin Accounts**
   - Only give admin access to trusted people
   - Fewer admins = less risk

2. **Audit Regularly**
   - Check admin list monthly
   - Remove ex-employees/inactive admins

3. **Use Firebase Auth Features**
   - Enable email verification
   - Consider multi-factor authentication
   - Monitor sign-in activity in Firebase Console

4. **Document Your Admins**
   - Keep a list of who has admin access
   - Note why they need it
   - Review quarterly

## 🔍 Troubleshooting

### "Someone signed in but isn't in Firestore"
- They need to sign in at least once for their document to be created
- Check the `users` collection after they sign in

### "Changed role to admin but still seeing 'Access Denied'"
- They need to refresh their browser (Ctrl+R)
- Or sign out and sign in again

### "Can't find their user document"
- Make sure they signed in first
- Search by their email address
- Check they're using the correct Google account

### "Accidentally deleted an admin"
- No worries! Just have them sign in again
- Their user document will be recreated
- Set their role back to "admin"

## 📊 Admin Dashboard Features

Once someone is an admin, they can:

### View & Manage Sellers
- See all pending seller applications
- View application details (products, social media)
- Verify or reject applications
- Verification sends automatic email to seller

### Manage Products
- View all products from all verified stores
- See which store each product belongs to
- Monitor product catalog

### View Orders
- See all orders across all stores
- Track order status
- View customer information
- Monitor platform revenue

### Platform Statistics
- Total revenue across all stores
- Number of orders
- Number of products
- Pending applications count

## 🎯 Best Practices

### Keep It Simple
- Start with just 1-2 admins
- Add more only when needed
- Too many admins can cause confusion

### Clear Responsibilities
- Define what each admin does
- Example: One handles seller verification, one handles support

### Regular Communication
- If you have multiple admins, coordinate
- Use a shared channel (Slack, email, etc.)
- Avoid duplicate work

### Document Changes
- Keep notes when you add/remove admins
- Track who verified which stores
- Helpful for accountability

## 🚀 Quick Reference

**To make someone an admin:**
```
1. They sign in → Creates user document
2. Firebase Console → Firestore → users
3. Find their document
4. Change role: "user" → "admin"
5. Done!
```

**To remove admin access:**
```
1. Firebase Console → Firestore → users
2. Find their document
3. Change role: "admin" → "user"
4. Done!
```

**Current admins:**
```
Firebase Console → Firestore → users
Filter by: role == "admin"
```

---

## 💡 Pro Tips

- **For team management:** Consider using a spreadsheet to track admins, sellers, and their responsibilities
- **For security:** Regularly review admin list (monthly)
- **For efficiency:** Document common tasks so any admin can help
- **For scale:** As you grow, you might want custom permission levels (super admin, moderator, etc.) - but start simple!

---

**Remember: Admin access is powerful. Only grant it to people you trust!** 🔐


