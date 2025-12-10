# 📧 Order Email Notifications - Complete Guide

## Overview

When a customer places an order, the system sends email notifications to:
1. **Sellers** - Each seller receives email for products from their store
2. **Admin** - Platform admin receives email with full order details
3. **Customer** - Order confirmation email

---

## ✅ What I Just Fixed

### Improvements:
1. **Better Email Address Detection**
   - Now uses seller's Google account email (primary)
   - Falls back to store contactEmail if needed

2. **Enhanced Logging**
   - See exactly which emails are being sent
   - Better error messages if emails fail
   - Check terminal/console for email status

3. **API Key Check**
   - Warns if Resend API key is not configured

---

## 🔧 How It Works

### Email Flow:
```
Customer Places Order
  ↓
System Creates Order in Firestore
  ↓
Identifies Store(s) Involved
  ↓
For Each Store:
  ├─ Gets Store Owner's Email (Google account)
  ├─ Calculates Store's Total
  └─ Sends Email with Store's Items
  ↓
Sends Email to Admin
  ├─ Full order details
  └─ All stores involved
  ↓
Sends Confirmation to Customer
  └─ Order summary
```

### Email Recipients:

**Seller Email (for each store):**
- **To:** Seller's Google account email
- **Subject:** `New Order #123 - Store Name`
- **Contains:**
  - Order ID
  - Store's total amount
  - Customer information
  - Only items from their store
  - Prompt to process order

**Admin Email:**
- **To:** `process.env.ADMIN_EMAIL` or default
- **Subject:** `New Order #123 - Platform Admin Notification`
- **Contains:**
  - Full order details
  - Total amount
  - All items from all stores
  - Number of stores involved

**Customer Email:**
- **To:** Customer's email from checkout
- **Subject:** `Order Confirmation #123`
- **Contains:**
  - Order summary
  - All items
  - Shipping address
  - Thank you message

---

## 🐛 Troubleshooting

### Issue 1: Sellers Not Receiving Emails

#### Check 1: Is Resend Configured?
```bash
# Check your .env.local file
RESEND_API_KEY=re_xxxxxxxxxx  # Must be present
```

**Fix:**
1. Go to https://resend.com/api-keys
2. Create an API key
3. Add to `.env.local`
4. Restart dev server

#### Check 2: Check Seller's Email
1. Sign in as seller
2. Go to Firebase Console → Firestore → `users` collection
3. Find seller's document (ID = their Firebase Auth UID)
4. Check `email` field - this is where notifications go

**Fix if wrong:**
- Seller should sign out and sign in again
- This will update their email in Firestore

#### Check 3: Check Store's ownerUid
1. Firebase Console → Firestore → `stores` collection
2. Find seller's store
3. Check `ownerUid` field
4. Should match seller's user document ID

**Fix if wrong:**
```javascript
// In Firebase Console, update the store document
ownerUid: "correct_firebase_auth_uid"
```

#### Check 4: Check Terminal Logs
When an order is placed, check terminal for:
```
📬 Preparing to send emails to 2 store(s)
📧 Sending email to seller: seller@gmail.com for store: Store Name
✅ All order emails sent successfully!
```

**If you see:**
```
⚠️ RESEND_API_KEY not configured - emails will not be sent
```
→ Add Resend API key to `.env.local`

**If you see:**
```
⚠️ Store not found for storeId: xyz
```
→ Product's storeId doesn't match any store (data integrity issue)

**If you see:**
```
❌ Failed to send order emails: Error message here
```
→ Check the specific error message

---

### Issue 2: Only Admin Receiving Emails

**Possible Causes:**
1. Resend free tier limitations (only verified emails)
2. Seller email not verified in Resend
3. Seller has no store (shouldn't be a seller)

**Fix:**

#### Resend Email Verification:
Resend requires email verification on free tier:

1. **Go to Resend Dashboard:**
   - https://resend.com/domains

2. **Add Your Domain** (recommended):
   - Add your custom domain
   - Verify DNS records
   - Send from `orders@yourdomain.com`

**OR**

3. **Verify Individual Emails:**
   - Go to https://resend.com/settings/emails
   - Add each seller's email
   - They'll receive verification email
   - Must click to verify

**Note:** With `onboarding@resend.dev`, you can only send to verified emails on free tier.

---

### Issue 3: Emails Going to Spam

**Solutions:**

1. **Set up Custom Domain in Resend:**
   - More professional
   - Better deliverability
   - Not marked as spam

2. **Update Email "From" Address:**
   In `app/api/orders/route.ts`:
   ```typescript
   from: 'orders@yourdomain.com'  // Instead of onboarding@resend.dev
   ```

3. **Add SPF and DKIM Records:**
   - Resend provides these in domain settings
   - Add to your domain's DNS
   - Improves email reputation

---

## 🧪 Testing Email Notifications

### Test Locally:

1. **Make Sure Resend is Configured:**
   ```bash
   # .env.local
   RESEND_API_KEY=re_your_actual_key
   ```

2. **Restart Dev Server:**
   ```bash
   npm run dev
   ```

3. **Create a Test Order:**
   - Add product to cart
   - Go through checkout
   - Submit order

4. **Check Terminal for Logs:**
   ```
   POST /api/orders - Creating new order
   📬 Preparing to send emails to 1 store(s)
   📧 Sending email to seller: seller@example.com for store: Test Store
   📧 Sending admin notification to: admin@example.com
   📧 Sending order confirmation to customer: customer@example.com
   ✅ All order emails sent successfully!
   ```

5. **Check Inboxes:**
   - Seller's Gmail/inbox
   - Admin's inbox
   - Customer's inbox
   - Also check **spam folders**

---

## 📋 Email Templates

### Seller Email Preview:
```
Subject: New Order #abc123 - My Store

New Order for My Store!

Order Details
Order ID: abc123
Your Store Total: $50.00
Status: pending

Customer Information
Name: John Doe
Email: john@example.com
Phone: +1234567890
Address: 123 Main St, City, State

Items from Your Store
- Product Name
  Price: $25.00 × 2 = $50.00

Please process this order and contact the customer if needed.
```

### Admin Email Preview:
```
Subject: New Order #abc123 - Platform Admin Notification

New Order Received!

Order Details
Order ID: abc123
Total: $75.00
Status: pending
Stores Involved: 2

Customer Information
Name: John Doe
Email: john@example.com
Address: 123 Main St

All Items Ordered
- Product A: $25.00 × 2 = $50.00
- Product B: $25.00 × 1 = $25.00

Individual store owners have been notified.
```

---

## 🔐 Environment Variables

### Required:
```bash
# .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
```

### Optional:
```bash
# Override default admin email
ADMIN_EMAIL=youradmin@example.com
```

**Default Admin Email:** `wingsofchangeghana@gmail.com`

---

## 🚀 Production Recommendations

### Before Deploying:

1. **✅ Set Up Custom Domain in Resend:**
   - Professional appearance
   - Better deliverability
   - Not marked as spam

2. **✅ Add Environment Variable to Vercel:**
   ```
   RESEND_API_KEY=re_xxxxx
   ADMIN_EMAIL=admin@yourdomain.com
   ```

3. **✅ Update "From" Email:**
   Change from `onboarding@resend.dev` to `orders@yourdomain.com`

4. **✅ Test Thoroughly:**
   - Create test orders
   - Check all email inboxes
   - Verify content is correct

5. **✅ Set Up Email Monitoring:**
   - Check Resend dashboard for delivery status
   - Monitor bounce rates
   - Check spam complaints

---

## 📊 Monitoring Emails

### In Resend Dashboard:
- https://resend.com/emails
- See all sent emails
- Check delivery status
- View bounce/spam reports

### In Your Terminal:
- Watch logs when orders are placed
- See which emails are sent
- Debug issues in real-time

---

## ✅ Quick Checklist

When setting up email notifications:

- [ ] Resend API key added to `.env.local`
- [ ] Dev server restarted after adding key
- [ ] Admin email set in environment variables (optional)
- [ ] Sellers have correct email in Firestore users collection
- [ ] Stores have correct ownerUid linking to sellers
- [ ] Test order placed successfully
- [ ] Seller received email
- [ ] Admin received email
- [ ] Customer received email
- [ ] Checked spam folders
- [ ] Production: Added RESEND_API_KEY to Vercel
- [ ] Production: Set up custom domain (recommended)

---

## 💡 Common Questions

**Q: Why is seller not getting emails but admin is?**  
A: Check if seller's email is verified in Resend (free tier limitation) or if store's ownerUid is correct.

**Q: Can I customize email templates?**  
A: Yes! Edit the HTML in `app/api/orders/route.ts` lines 104-136 (seller), 145-178 (admin), 186-219 (customer).

**Q: How do I change the "From" email?**  
A: Set up a custom domain in Resend, then update `from:` in the email sending code.

**Q: Emails going to spam, what to do?**  
A: Set up custom domain with SPF/DKIM records in Resend.

**Q: How many emails can I send?**  
A: Resend free tier: 100 emails/day, 3,000/month. Upgrade for more.

---

**Emails should now work for sellers! Test it and check the terminal logs!** 📧✨

