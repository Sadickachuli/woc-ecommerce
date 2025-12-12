# 📧 Resend Email Setup Guide

## Current Status
- ✅ Resend account created: `xentofwocghana@gmail.com`
- ✅ Domain added: `xentshop.com`
- ✅ DNS records added to Vercel
- ⏳ Pending: API key configuration and testing

---

## Step 1: Get Your Resend API Key

1. **Go to Resend Dashboard:**
   - Visit: https://resend.com/api-keys
   - Sign in with `xentofwocghana@gmail.com`

2. **Create a New API Key:**
   - Click **"Create API Key"**
   - Name it: `Production - xentshop.com`
   - Permission: **"Sending access"** (Full Access)
   - Copy the API key (starts with `re_...`)
   - ⚠️ **IMPORTANT**: Save it immediately - you won't see it again!

---

## Step 2: Verify Your Domain Status

1. **Check Domain Verification:**
   - Go to: https://resend.com/domains
   - Find `xentshop.com`
   - Status should be **"Verified"** ✅
   
2. **If NOT verified:**
   - Click on the domain
   - Check all DNS records are added:
     - **SPF Record** (TXT)
     - **DKIM Record** (TXT)
     - **DMARC Record** (TXT - optional but recommended)
   
3. **Verify DNS in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Domains
   - Check that all Resend DNS records are added
   - Wait 5-10 minutes for propagation

---

## Step 3: Update Local Environment Variables

**Edit your `.env.local` file:**

```bash
# Resend Configuration
RESEND_API_KEY=re_your_actual_api_key_here

# Admin Email (where platform notifications go)
ADMIN_EMAIL=xentofwocghana@gmail.com

# Your verified domain
RESEND_FROM_DOMAIN=xentshop.com
```

**After editing:**
1. Save the file
2. Restart your development server:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

---

## Step 4: Update Code to Use Your Domain

The code currently uses `onboarding@resend.dev` (test email). We need to change it to your verified domain.

**You can use:**
- `orders@xentshop.com` (for order notifications)
- `noreply@xentshop.com` (for automated emails)
- Any email address @xentshop.com

⚠️ **Note**: You don't need to create these email addresses - Resend handles sending from any address on your verified domain!

---

## Step 5: Deploy to Vercel

**Add environment variables to Vercel:**

1. Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

2. Add these variables:
   - `RESEND_API_KEY` = `re_your_actual_api_key`
   - `ADMIN_EMAIL` = `xentofwocghana@gmail.com`
   - `RESEND_FROM_DOMAIN` = `xentshop.com`

3. Apply to: **Production, Preview, and Development**

4. Redeploy your site (or it will auto-deploy on next push)

---

## Step 6: Test Email Delivery

### Local Testing:
1. Place a test order on `localhost:3000`
2. Check terminal for email logs:
   ```
   📧 Sending email to seller: seller@gmail.com for store: Store Name
   ✅ Email sent successfully
   📧 Sending admin notification to: xentofwocghana@gmail.com
   ✅ Email sent successfully
   ```

3. **Check Email Inboxes:**
   - ✅ Seller's Gmail
   - ✅ Admin: `xentofwocghana@gmail.com`
   - ✅ Customer email
   - 🔍 **Also check spam/junk folders!**

### Production Testing:
1. Visit your live site (`xentshop.com`)
2. Place a test order
3. Check all email inboxes (including spam)

---

## 📊 Email Flow Diagram

```
Customer Places Order
         │
         ├─► 🔵 Seller Email (seller@gmail.com)
         │   └─ "New Order #123 for Your Store"
         │
         ├─► 🔴 Admin Email (xentofwocghana@gmail.com)
         │   └─ "Platform Admin Notification - Order #123"
         │
         └─► 🟢 Customer Email
             └─ "Order Confirmation #123"
```

---

## 🚨 Troubleshooting

### Problem: Emails Not Sending

**Check 1: API Key**
```bash
# In terminal, test if API key is loaded:
echo $RESEND_API_KEY  # Should show: re_...
```

**Check 2: Domain Verification**
- Resend Dashboard → Domains → Should be "Verified"
- If "Pending", wait for DNS propagation (up to 24 hours)

**Check 3: Terminal Logs**
Look for these indicators:
- ✅ `Email sent successfully`
- ❌ `Email failed:` followed by error message

**Check 4: Resend Dashboard**
- Go to: https://resend.com/emails
- See all sent emails and their status

### Problem: Emails Go to Spam

**Solutions:**
1. ✅ Verify all DNS records (SPF, DKIM, DMARC)
2. ✅ Use professional email copy (avoid spam trigger words)
3. ✅ Whitelist your domain in recipient's email settings
4. ✅ Send test emails to yourself first

### Problem: Wrong "From" Address

If emails show `onboarding@resend.dev` instead of your domain:
- The code needs updating (I'll do this next)
- Environment variable `RESEND_FROM_DOMAIN` not set
- Server not restarted after `.env.local` change

---

## 📝 Quick Checklist

- [ ] Get Resend API key from dashboard
- [ ] Verify domain is "Verified" status
- [ ] Update `.env.local` with API key
- [ ] Add `ADMIN_EMAIL=xentofwocghana@gmail.com`
- [ ] Add `RESEND_FROM_DOMAIN=xentshop.com`
- [ ] Restart development server
- [ ] Update code to use custom domain
- [ ] Add environment variables to Vercel
- [ ] Test locally
- [ ] Deploy to production
- [ ] Test on live site

---

## 🎯 Next Steps

Once you have your API key:
1. Share it with me (or add it to `.env.local` yourself)
2. I'll update the code to use your custom domain
3. We'll test it together!

---

## 📞 Support Resources

- **Resend Docs**: https://resend.com/docs
- **Domain Setup**: https://resend.com/docs/dashboard/domains/introduction
- **API Reference**: https://resend.com/docs/api-reference/emails/send-email
- **DNS Check Tool**: https://mxtoolbox.com/

