# 🚨 Vercel Email Not Working - Troubleshooting Guide

## Issue: Emails work on localhost but NOT on deployed Vercel site

### ✅ Quick Checklist

**1. Environment Variables on Vercel**

Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

Make sure these are ALL set:

| Variable | Value | Check |
|----------|-------|-------|
| `RESEND_API_KEY` | `re_...` (your actual key) | ☐ |
| `ADMIN_EMAIL` | `xentofwocghana@gmail.com` | ☐ |
| `RESEND_FROM_DOMAIN` | `xentshop.com` | ☐ |
| `NEXT_PUBLIC_APP_URL` | `https://xentshop.com` | ☐ |

**Applied to:** Production, Preview, AND Development ✅

---

**2. Redeploy After Adding Environment Variables**

Environment variables only take effect after redeployment!

**Two ways to redeploy:**

**Option A: Force Redeploy (Recommended)**
```bash
# In your local project
git commit --allow-empty -m "trigger redeploy"
git push origin master
```

**Option B: From Vercel Dashboard**
- Go to Deployments tab
- Click "..." on latest deployment
- Click "Redeploy"

---

**3. Check Domain Verification in Resend**

Go to: https://resend.com/domains

- `xentshop.com` should show **"Verified" ✅**
- All DNS records should be green ✅

If not verified:
- DNS changes can take up to 24-48 hours
- Check DNS records in Vercel domain settings
- Wait for propagation

---

**4. Check Vercel Function Logs**

**Where to check:**
1. Go to Vercel Dashboard
2. Click on your project
3. Go to "Deployments" → Click latest deployment
4. Click "Functions" tab
5. Look for `/api/orders` function
6. Check logs for errors

**What to look for:**
```
❌ Bad signs:
- "RESEND_API_KEY not configured"
- "Failed to send email"
- 500 errors

✅ Good signs:
- "📧 Sending email to..."
- "✅ Email sent successfully"
```

---

**5. Test Email Sending Manually**

Create a test API endpoint to diagnose:

**Create:** `app/api/test-email/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET() {
  try {
    // Check if API key exists
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        error: 'RESEND_API_KEY not configured',
        hint: 'Add it to Vercel environment variables'
      }, { status: 500 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    
    const fromEmail = process.env.RESEND_FROM_DOMAIN 
      ? `test@${process.env.RESEND_FROM_DOMAIN}`
      : 'onboarding@resend.dev'

    const result = await resend.emails.send({
      from: fromEmail,
      to: process.env.ADMIN_EMAIL || 'xentofwocghana@gmail.com',
      subject: '🧪 Test Email from Vercel',
      html: '<h1>✅ Email is working!</h1><p>This test email was sent from your Vercel deployment.</p>',
    })

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully!',
      result,
      config: {
        hasApiKey: !!process.env.RESEND_API_KEY,
        fromDomain: process.env.RESEND_FROM_DOMAIN,
        adminEmail: process.env.ADMIN_EMAIL,
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error',
      config: {
        hasApiKey: !!process.env.RESEND_API_KEY,
        fromDomain: process.env.RESEND_FROM_DOMAIN,
        adminEmail: process.env.ADMIN_EMAIL,
      }
    }, { status: 500 })
  }
}
```

**How to test:**
1. Deploy the above file
2. Visit: `https://your-site.vercel.app/api/test-email`
3. Check response:
   - ✅ Success = Email sent!
   - ❌ Error = See error details

---

**6. Common Issues & Solutions**

### Issue: "RESEND_API_KEY not configured"

**Solution:**
1. Go to Resend dashboard: https://resend.com/api-keys
2. Copy your API key
3. Add to Vercel environment variables
4. Redeploy (MUST redeploy!)

### Issue: Domain not verified

**Solution:**
1. Go to: https://resend.com/domains
2. Click on `xentshop.com`
3. Copy DNS records
4. Add to Vercel: Project Settings → Domains → DNS
5. Wait 5-60 minutes for propagation
6. Refresh Resend page to see verification

### Issue: Emails work but go to spam

**Solution:**
- This is normal for new domains (1-2 weeks to build reputation)
- Tell users to check spam folder (we already do this!)
- Add domain to contacts
- Mark first email as "Not Spam"

### Issue: Function timeout

**Solution:**
- Vercel free tier has 10-second timeout
- Email sending should be fast (< 2 seconds)
- If timing out, check Resend API is responding
- Consider using edge runtime for faster execution

---

**7. Verify Environment Variables Are Loaded**

**Add to your order API (temporarily for debugging):**

```typescript
// At the start of POST function in app/api/orders/route.ts
console.log('🔍 Environment Check:', {
  hasResendKey: !!process.env.RESEND_API_KEY,
  resendKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 5),
  adminEmail: process.env.ADMIN_EMAIL,
  fromDomain: process.env.RESEND_FROM_DOMAIN,
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
})
```

**Check logs in Vercel:**
- Should show all values as true/present
- If any are missing, environment variable not set correctly

---

**8. Check Resend Dashboard**

Go to: https://resend.com/emails

**What to check:**
- Are emails showing up in the list?
- What's their status?
  - ✅ **Delivered** = Success!
  - ⏳ **Queued** = Still sending
  - ❌ **Bounced** = Bad email address
  - ❌ **Failed** = Configuration issue

**If no emails appear:**
- API key is wrong
- Emails aren't being sent at all
- Check Vercel function logs

---

**9. Step-by-Step Diagnostic**

**Do this IN ORDER:**

1. ✅ **Check Vercel Environment Variables**
   - All 4 variables set?
   - Applied to Production?
   
2. ✅ **Redeploy**
   ```bash
   git commit --allow-empty -m "redeploy"
   git push origin master
   ```

3. ✅ **Test with test-email endpoint**
   - Create the test endpoint above
   - Visit `/api/test-email`
   - Did email arrive?

4. ✅ **Place a real order**
   - Does it complete without errors?
   - Check Vercel function logs
   - Check Resend dashboard

5. ✅ **Check all inboxes**
   - Admin email
   - Customer email
   - Seller email
   - **Check spam folders!**

---

**10. Nuclear Option: Reset Everything**

If nothing works:

```bash
# 1. Delete ALL environment variables in Vercel
# 2. Re-add them one by one:

RESEND_API_KEY=re_your_actual_key_here
ADMIN_EMAIL=xentofwocghana@gmail.com
RESEND_FROM_DOMAIN=xentshop.com
NEXT_PUBLIC_APP_URL=https://xentshop.com

# 3. Make sure "Production" is checked
# 4. Redeploy
git commit --allow-empty -m "force redeploy"
git push origin master

# 5. Wait 2-3 minutes for deployment
# 6. Test order again
```

---

## ✅ Most Likely Issues

**90% of production email issues are:**

1. **Environment variables not set** (50%)
   - Solution: Add to Vercel, redeploy

2. **Didn't redeploy after adding variables** (30%)
   - Solution: Force redeploy

3. **Wrong API key** (10%)
   - Solution: Copy fresh key from Resend

4. **Domain not verified** (8%)
   - Solution: Check DNS, wait for propagation

5. **Actually working but in spam** (2%)
   - Solution: Check spam folder!

---

## 📞 Quick Support

**Still not working?**

1. Check Vercel function logs
2. Check Resend dashboard
3. Share error messages
4. Verify all environment variables are set

**Most issues are fixed by:**
```bash
# Double-check environment variables in Vercel
# Then:
git commit --allow-empty -m "redeploy"
git push origin master
```

---

## 🎯 Success Checklist

- [ ] All 4 environment variables set in Vercel
- [ ] Applied to "Production" environment
- [ ] Redeployed after adding variables
- [ ] Domain verified in Resend (green checkmark)
- [ ] Test order placed on live site
- [ ] Checked Vercel function logs (no errors)
- [ ] Checked Resend dashboard (emails sent)
- [ ] Checked email inbox (including spam)
- [ ] Success! 🎉

