# 🚀 Vercel Deployment - Firebase Auth Fix

## Problem: "Failed to sign in. Please try again"

This happens because Firebase needs to be configured for your live Vercel domain.

---

## ✅ Solution (Follow in Order):

### Step 1: Add Environment Variables to Vercel

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Select your project
3. Click **Settings** → **Environment Variables**
4. Add each variable (copy from your local `.env.local`):

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=wingsocecommerce.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=wingsocecommerce
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=wingsocecommerce.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
RESEND_API_KEY=your_resend_key (optional, for emails)
```

5. **Important:** Select **All Environments** (Production, Preview, Development)
6. Click **Save**

### Step 2: Authorize Your Vercel Domain in Firebase

1. Go to **Firebase Console**: https://console.firebase.google.com
2. Select your project: **wingsocecommerce**
3. Left sidebar → **Authentication**
4. Click **Settings** tab at the top
5. Scroll down to **Authorized domains**
6. Click **Add domain** button
7. Enter your Vercel deployment URL (e.g., `your-app.vercel.app`)
   - **Don't include** `https://` or trailing `/`
   - **Just the domain:** `your-app.vercel.app`
8. Click **Add**
9. If you have a custom domain, add that too

**Example of what it should look like:**
```
✅ localhost
✅ your-project.vercel.app
✅ your-project-git-master-yourname.vercel.app (preview domains)
✅ yourdomain.com (if you have one)
```

### Step 3: Redeploy on Vercel

After adding environment variables:

1. Go to **Deployments** tab in Vercel
2. Find the latest deployment
3. Click the **"..."** menu → **Redeploy**
4. Make sure **"Use existing Build Cache"** is **OFF**
5. Click **Redeploy**

---

## 🔍 How to Find Your Vercel Domain

**Your deployment URL is in Vercel:**
1. Go to your project in Vercel
2. You'll see it at the top: `https://your-project-name.vercel.app`
3. Copy everything after `https://` (just the domain part)

---

## 🧪 Testing After Fix

1. Wait for Vercel redeploy to complete (2-3 minutes)
2. Open your live site
3. Try signing in with Google
4. Should work now! ✅

---

## ❌ Still Not Working?

### Check Browser Console:

1. Open your live Vercel site
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Try to sign in
5. Look for error messages

**Common Errors & Fixes:**

| Error | Fix |
|-------|-----|
| `auth/unauthorized-domain` | Add domain to Firebase authorized domains (Step 2) |
| `auth/api-key-not-valid` | Environment variables incorrect in Vercel (Step 1) |
| `Firebase: No Firebase App` | Environment variables missing (Step 1) |
| `auth/configuration-not-found` | Firebase project misconfigured, check project ID |

---

## 📋 Checklist

Before asking for help, verify:

- [ ] All environment variables added to Vercel (Step 1)
- [ ] Environment variables set for "All Environments"
- [ ] Vercel domain added to Firebase authorized domains (Step 2)
- [ ] Redeployed after adding environment variables (Step 3)
- [ ] Waited for deployment to complete
- [ ] Tested in a fresh browser/incognito window (clear cache)
- [ ] Checked browser console for specific error messages

---

## 💡 Pro Tips

### Preview Deployments:
If you push to a branch, Vercel creates preview URLs like:
```
your-project-git-feature-branch-username.vercel.app
```

You can add a **wildcard domain** in Firebase:
```
*.vercel.app
```
This allows all your Vercel preview deployments to work!

### Environment Variable Values:
- Copy them **exactly** from your local `.env.local`
- No quotes needed in Vercel UI
- No spaces before/after the value
- Click "Save" after each variable

### Custom Domains:
If you connected a custom domain in Vercel:
1. Add it to Firebase authorized domains too
2. Both `yourdomain.com` and `www.yourdomain.com` if using both

---

## 🎯 Quick Summary

The error happens because:
1. Firebase doesn't know about your Vercel domain → **Add to authorized domains**
2. Vercel doesn't have your Firebase config → **Add environment variables**
3. Old build without variables → **Redeploy**

**Fix = Configure both Firebase and Vercel, then redeploy! 🚀**

---

Need more help? Share:
- Your Vercel deployment URL
- The exact error from browser console
- Screenshot of Firebase authorized domains

