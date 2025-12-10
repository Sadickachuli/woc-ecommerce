# 💱 Multi-Currency Support - Feature Guide

## Overview

Sellers can now choose their preferred currency for their store. All products in a store will display prices in the selected currency.

---

## ✨ What's New

### For Sellers:
1. **Currency Selection** in Store Settings
   - 12 supported currencies (USD, EUR, GBP, NGN, GHS, KES, ZAR, CAD, AUD, JPY, CNY, INR)
   - Set once for entire store
   - All products automatically use store's currency

### For Buyers:
1. **Product Prices** display in store's currency
   - Correct currency symbol ($ € £ ₦ ₵ etc.)
   - Proper formatting

---

## 🎯 How It Works

### 1. Seller Sets Currency

**Location:** `/admin/store-settings`

**Steps:**
1. Seller signs in
2. Goes to Dashboard → "Customize Store"
3. First section: "Store Currency"
4. Dropdown with 12 currencies:
   - $ USD - US Dollar
   - € EUR - Euro
   - £ GBP - British Pound
   - ₦ NGN - Nigerian Naira
   - ₵ GHS - Ghanaian Cedi
   - KSh KES - Kenyan Shilling
   - R ZAR - South African Rand
   - C$ CAD - Canadian Dollar
   - A$ AUD - Australian Dollar
   - ¥ JPY - Japanese Yen
   - ¥ CNY - Chinese Yuan
   - ₹ INR - Indian Rupee
5. Select preferred currency
6. Click "Save Changes"

**Default:** USD if not set

### 2. Products Display Currency

**Where:**
- Products page (`/products`) - All store products
- Individual store page (`/store/[storeId]`) - Store's products
- Product cards - Price display
- Product modals - Price details

**Format:**
```
USD: $99.99
EUR: €99.99
GBP: £99.99
NGN: ₦99.99
GHS: ₵99.99
etc.
```

---

## 📁 Technical Implementation

### Files Modified:

1. **`lib/currencies.ts`** (NEW)
   - Currency definitions
   - Helper functions: `formatPrice()`, `getCurrency()`, `getCurrencySymbol()`

2. **`lib/firebase/firestore.ts`**
   - Added `currency?: string` to `Store` interface
   - Updated `updateStoreBranding()` to accept partial Store updates

3. **`app/admin/store-settings/page.tsx`**
   - Added currency selector dropdown
   - Currency saved at store level
   - Loaded with existing branding

4. **`app/components/ProductCard.tsx`**
   - Added `currency` prop
   - Uses `formatPrice()` for all price displays
   - Currency passed from parent

5. **`app/components/ProductGrid.tsx`**
   - Added `stores` prop
   - Creates store lookup map
   - Passes currency to `ProductCard`

6. **`app/products/page.tsx`**
   - Passes `stores` to `ProductGrid`

7. **`app/store/[storeId]/page.tsx`**
   - Passes store to `ProductGrid`

---

## 🔧 Data Structure

### Firestore `stores` Collection:
```typescript
{
  id: "store123",
  storeName: "My Store",
  currency: "NGN",  // ← NEW FIELD
  branding: {
    logo: "...",
    primaryColor: "#...",
    // ...
  },
  // ... other fields
}
```

### Products (No Change):
```typescript
{
  id: "prod123",
  name: "Product",
  price: 99.99,  // Still a number
  storeId: "store123",  // Lookup store for currency
  // ...
}
```

**Note:** Product prices remain as numbers. Currency is determined by the store they belong to.

---

## 💡 Key Features

### 1. Store-Level Currency
- **One currency per store** (not per product)
- Simplifies management for sellers
- Consistent pricing display for buyers

### 2. Automatic Formatting
- Correct symbol placement (before/after price)
- Decimal formatting (2 decimal places)
- Symbol specific to currency

### 3. Backward Compatible
- **Existing stores default to USD**
- No breaking changes
- Products without store currency show USD

### 4. Easy to Extend
- Add new currencies in `lib/currencies.ts`
- Just add to `CURRENCIES` array
- Automatic dropdown population

---

## 🧪 Testing Locally

### Test Currency Selection:
1. Sign in as seller
2. Go to `/admin/store-settings`
3. Select different currency (e.g., NGN)
4. Save changes
5. Go to `/products` or `/store/[your-store-id]`
6. Verify products show ₦ symbol

### Test Multiple Stores:
1. Create multiple seller accounts
2. Set different currencies for each
3. View products page
4. Products from each store show their respective currencies

---

## 🌍 Supported Currencies

| Code | Symbol | Name | Position |
|------|--------|------|----------|
| USD | $ | US Dollar | Before |
| EUR | € | Euro | Before |
| GBP | £ | British Pound | Before |
| NGN | ₦ | Nigerian Naira | Before |
| GHS | ₵ | Ghanaian Cedi | Before |
| KES | KSh | Kenyan Shilling | Before |
| ZAR | R | South African Rand | Before |
| CAD | C$ | Canadian Dollar | Before |
| AUD | A$ | Australian Dollar | Before |
| JPY | ¥ | Japanese Yen | Before |
| CNY | ¥ | Chinese Yuan | Before |
| INR | ₹ | Indian Rupee | Before |

---

## 🔮 Future Enhancements (Not Implemented Yet)

Potential additions:
- Currency conversion API integration
- Per-product currency override
- Multi-currency checkout
- Real-time exchange rates
- Regional currency detection

---

## ✅ Summary

**For Sellers:**
- Choose your currency in Store Settings
- All your products use that currency
- Easy to change anytime

**For Buyers:**
- See prices in seller's currency
- Clear currency symbols
- Consistent across store

**Technical:**
- Simple, clean implementation
- No breaking changes
- Easy to test and extend

---

**Ready to test! Check it out locally before pushing to GitHub!** 🚀

