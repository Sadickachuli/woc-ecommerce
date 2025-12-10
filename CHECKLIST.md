# 🎯 Firebase Setup Checklist

Follow this checklist in order. Check off each item as you complete it!

## ☐ 1. Create Firebase Project
- [ ] Go to https://console.firebase.google.com/
- [ ] Click "Add project" or "Create a project"
- [ ] Name it (e.g., "woc-ecommerce")
- [ ] Create the project

## ☐ 2. Enable Google Authentication
- [ ] Go to Authentication in Firebase Console
- [ ] Click "Get started"
- [ ] Enable "Google" provider
- [ ] Save

## ☐ 3. Create Firestore Database
- [ ] Go to Firestore Database
- [ ] Click "Create database"
- [ ] Choose "Production mode"
- [ ] Select your region
- [ ] Click "Enable"

## ☐ 4. Set Security Rules
- [ ] In Firestore, go to "Rules" tab
- [ ] Copy rules from `SETUP_INSTRUCTIONS.md` (Step 4)
- [ ] Paste and click "Publish"

## ☐ 5. Get Firebase Config
- [ ] Click ⚙️ (Project Settings)
- [ ] Scroll to "Your apps"
- [ ] Click Web icon (`</>`)
- [ ] Register app
- [ ] Copy the `firebaseConfig` values

## ☐ 6. Create .env.local File
- [ ] Create file named `.env.local` in project root
- [ ] Copy from `.env.local.example`
- [ ] Paste your Firebase config values
- [ ] Add your Resend API key
- [ ] Save the file

## ☐ 7. Restart Dev Server
- [ ] Stop server (Ctrl+C)
- [ ] Run `npm run dev`
- [ ] Wait for it to start

## ☐ 8. Test Sign In
- [ ] Go to http://localhost:3000/admin
- [ ] You should see "Sign in with Google" button
- [ ] Click it
- [ ] Sign in with your Google account

## ☐ 9. Set Admin Role
- [ ] Go to Firebase Console → Firestore Database
- [ ] Open `users` collection
- [ ] Find your user document
- [ ] Edit the `role` field to `"admin"`
- [ ] Save

## ☐ 10. Verify Access
- [ ] Go back to http://localhost:3000/admin
- [ ] Click "Refresh Page"
- [ ] You should be redirected to the dashboard!

---

## 🎉 Success!

If you can see the admin dashboard, everything is working!

### What to do next:
1. ✅ Explore the admin dashboard
2. ✅ Try applying as a seller (use different Google account)
3. ✅ Verify the seller application
4. ✅ Add products as a seller
5. ✅ View your store page

---

## ❌ Troubleshooting

**Problem:** Still seeing old login page
- **Solution:** Make sure `.env.local` exists and has correct values
- **Solution:** Restart dev server
- **Solution:** Clear browser cache

**Problem:** "Sign in with Google" button does nothing
- **Solution:** Check browser console (F12) for errors
- **Solution:** Make sure Google Sign-In is enabled in Firebase
- **Solution:** Check that Firebase config is correct in `.env.local`

**Problem:** Can't find my user in Firestore
- **Solution:** Sign in first, then check Firestore
- **Solution:** User is created automatically on first sign-in

**Problem:** "Permission denied" errors
- **Solution:** Check Firestore security rules are published
- **Solution:** Make sure you're signed in

---

## 📚 More Help

- `SETUP_INSTRUCTIONS.md` - Detailed step-by-step guide
- `FIREBASE_MIGRATION.md` - Complete technical documentation
- `QUICK_START.md` - Quick overview


