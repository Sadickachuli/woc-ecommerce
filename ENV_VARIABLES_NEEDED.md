# 🔧 Environment Variables Configuration

## Required for Email Notifications

Add these to your `.env.local` file:

```bash
# ==========================================
# RESEND EMAIL CONFIGURATION
# ==========================================

# 1. Get your API key from: https://resend.com/api-keys
RESEND_API_KEY=re_your_actual_api_key_here

# 2. Admin email (receives all order notifications)
ADMIN_EMAIL=xentofwocghana@gmail.com

# 3. Your verified domain in Resend
RESEND_FROM_DOMAIN=xentshop.com

# 4. Your app URL (for email links)
NEXT_PUBLIC_APP_URL=https://xentshop.com
```

---

## How It Works

### Email Addresses Used:

- **Seller & Admin Notifications**: `orders@xentshop.com`
  - Sends order notifications to sellers
  - Sends platform notifications to admin

- **Customer Emails**: `noreply@xentshop.com`
  - Sends order confirmations to customers

- **Store Verification**: `noreply@xentshop.com`
  - Sends verification emails to sellers

⚠️ **Note**: You don't need to create these email addresses! Resend handles sending from any address on your verified domain.

---

## Setup Steps

### 1. Local Development (`.env.local`)

Create or edit `.env.local` in your project root:

```bash
# Copy your Firebase config (already set up)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Add Resend configuration
RESEND_API_KEY=re_your_key_here
ADMIN_EMAIL=xentofwocghana@gmail.com
RESEND_FROM_DOMAIN=xentshop.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**After editing:**
```bash
# Stop your dev server (Ctrl+C)
npm run dev
```

---

### 2. Vercel Production

**Add to Vercel Dashboard:**

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to: **Settings** → **Environment Variables**
4. Add these variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `RESEND_API_KEY` | `re_your_key_here` | Production, Preview, Development |
| `ADMIN_EMAIL` | `xentofwocghana@gmail.com` | Production, Preview, Development |
| `RESEND_FROM_DOMAIN` | `xentshop.com` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://xentshop.com` | Production, Preview |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Development |

5. **Redeploy** or push a new commit

---

## Verification Checklist

### ✅ Before Testing:

- [ ] Created Resend account
- [ ] Added domain `xentshop.com` to Resend
- [ ] Added DNS records to Vercel
- [ ] Domain status is **"Verified"** in Resend
- [ ] Got API key from Resend dashboard
- [ ] Added all environment variables to `.env.local`
- [ ] Restarted development server
- [ ] Added environment variables to Vercel
- [ ] Redeployed on Vercel

### 📧 Test Emails:

**Local Test:**
1. Run `npm run dev`
2. Place a test order
3. Check terminal for logs:
   ```
   📧 Sending email to seller: seller@example.com
   ✅ Email sent successfully
   📧 Sending admin notification to: xentofwocghana@gmail.com
   ✅ Email sent successfully
   📧 Sending order confirmation to customer: customer@example.com
   ✅ Email sent successfully
   ```

**Production Test:**
1. Visit `https://xentshop.com`
2. Place a test order
3. Check email inboxes (including spam folders)

---

## Email Recipients

When an order is placed:

| Recipient | Email Template | Purpose |
|-----------|---------------|---------|
| **Seller** | "New Order #123 - Store Name" | Notifies seller of new order from their store |
| **Admin** | "Platform Admin Notification - Order #123" | Notifies admin of all platform orders |
| **Customer** | "Order Confirmation #123" | Confirms order was received |

---

## Troubleshooting

### Problem: "RESEND_API_KEY not configured"

**Solution:**
1. Check `.env.local` has the API key
2. Restart server: `npm run dev`
3. Verify API key starts with `re_`

### Problem: Emails not being received

**Check:**
1. ✅ Domain verified in Resend dashboard
2. ✅ Check spam/junk folders
3. ✅ View sent emails: https://resend.com/emails
4. ✅ Terminal shows "Email sent successfully"

### Problem: "Failed to send email"

**Check Terminal Logs:**
- Look for error messages
- Verify API key is correct
- Check domain is verified
- Ensure no rate limits exceeded

### Problem: Emails show wrong "From" address

**Solution:**
1. Verify `RESEND_FROM_DOMAIN=xentshop.com` is set
2. Restart server
3. Redeploy on Vercel

---

## Support

- **Resend Dashboard**: https://resend.com/emails
- **Domain Setup**: https://resend.com/domains
- **API Keys**: https://resend.com/api-keys
- **Documentation**: https://resend.com/docs

---

## Quick Reference

**Get Resend API Key:**
```
https://resend.com/api-keys → Create API Key
```

**Check Domain Status:**
```
https://resend.com/domains → xentshop.com → Should be "Verified"
```

**View Sent Emails:**
```
https://resend.com/emails
```

