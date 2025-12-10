# 🎨 Store Branding Guide

## Overview

Sellers can now fully customize their store's appearance with logos, banners, custom colors, and branding text. This makes each store unique and helps sellers build their brand identity.

## ✨ Features

### What Sellers Can Customize

| Feature | Description | Example |
|---------|-------------|---------|
| **Store Logo** | Square image displayed on store page and product listings | 200x200px company logo |
| **Store Banner** | Wide hero image at top of store page | 1200x300px cover photo |
| **Primary Color** | Main brand color for buttons and highlights | #3b82f6 (blue) |
| **Accent Color** | Secondary color for badges and accents | #8b5cf6 (purple) |
| **Tagline** | Short catchy phrase (60 char max) | "Handmade with Love ❤️" |
| **Description** | Detailed store description (500 char max) | About your products and story |

## 🎯 How to Access Store Branding

### For Sellers:

**Option 1: From Dashboard**
```
1. Sign in as seller
2. Go to /admin/dashboard
3. Look for "Store Information" card
4. Click "Customize Store" button
5. Opens store settings page
```

**Option 2: Direct Link**
```
Go to: /admin/store-settings
```

## 📸 Setting Up Your Branding

### Step 1: Upload Your Images

**For Logo & Banner Images:**

You need to host your images online first. Here are free options:

**Recommended: Imgur**
1. Go to https://imgur.com
2. Click "New post"
3. Upload your image
4. Right-click the image → "Copy image address"
5. Paste URL in the branding form

**Other Options:**
- **Google Drive:** Share image publicly, copy link
- **Dropbox:** Share image publicly, copy link  
- **GitHub:** Upload to your repository
- **Your own website:** If you have one

**Image Specifications:**

| Image | Recommended Size | Format | Tips |
|-------|-----------------|--------|------|
| **Logo** | 200x200px (square) | PNG with transparency | Keep it simple and recognizable |
| **Banner** | 1200x300px (4:1 ratio) | JPG or PNG | Use high-quality, branded images |

### Step 2: Choose Your Colors

**Primary Color:**
- Used for: Buttons, links, active states
- Should be: Your main brand color
- Must be: Easy to read white text on it
- Example: #3b82f6 (blue), #10b981 (green)

**Accent Color:**
- Used for: Badges, highlights, secondary elements
- Should be: Complementary to primary
- Can be: A variation or contrasting color
- Example: #8b5cf6 (purple), #f59e0b (amber)

**Color Picker:**
- Use the built-in color picker
- Or enter hex codes manually
- Preview updates in real-time

### Step 3: Write Your Store Text

**Tagline (60 characters):**
- Keep it short and memorable
- Examples:
  - "Handcrafted Jewelry Since 2020"
  - "Eco-Friendly Fashion 🌿"
  - "Your Tech Accessories Store"

**Description (500 characters):**
- Tell your brand story
- Describe what you sell
- Mention what makes you unique
- Include your values/mission
- Add personality!

Example:
```
Welcome to our store! We specialize in handcrafted leather goods 
made with 100% sustainable materials. Each piece is unique and made 
with care in our small workshop. We believe in quality over quantity 
and timeless designs that last. Thank you for supporting small 
businesses! 🌱
```

### Step 4: Save & Preview

1. **Fill out all fields** you want to customize
2. **Click "Save Changes"** at the top or bottom
3. **Click "Preview Store"** to see your changes live
4. **Adjust** if needed and save again

## 🌟 Where Your Branding Appears

### 1. Store Page (`/store/[storeId]`)

**Banner:**
- Full-width hero image at the top
- 264px height (responsive)

**Logo:**
- 80x80px next to store name
- Bordered with your primary color
- Falls back to colored circle with initial if no logo

**Colors:**
- "Verified Seller" badge uses accent color
- Left border on "About" section uses primary color
- Buttons and links use your colors

**Text:**
- Store name as main heading
- Tagline under store name
- Description in "About This Store" section

### 2. Products Page (`/products`)

**Store Cards:**
- Logo displayed (48x48px circular)
- Or colored circle with initial
- Store name
- Tagline (if set)
- Product count
- Border highlights use primary color when selected

### 3. Search Results

**When customers search:**
- Your logo appears in results
- Colors make your store recognizable
- Tagline helps customers remember you

## 🎨 Branding Best Practices

### Visual Identity

**DO:**
- ✅ Use consistent colors across logo, banner, and color scheme
- ✅ Choose high-contrast colors for readability
- ✅ Use professional, high-quality images
- ✅ Keep logo simple and recognizable at small sizes
- ✅ Make banner relevant to your products

**DON'T:**
- ❌ Use low-resolution or pixelated images
- ❌ Choose colors that are too similar (poor contrast)
- ❌ Use copyrighted images without permission
- ❌ Make text too long or hard to read
- ❌ Use offensive or inappropriate content

### Text Content

**DO:**
- ✅ Be authentic and genuine
- ✅ Highlight what makes you unique
- ✅ Use proper grammar and spelling
- ✅ Add personality and warmth
- ✅ Include relevant keywords

**DON'T:**
- ❌ Copy other sellers' descriptions
- ❌ Use all caps or excessive punctuation!!!
- ❌ Make unrealistic claims
- ❌ Leave fields blank (use defaults if unsure)
- ❌ Include contact info (it's already shown)

### Brand Consistency

**Across all touchpoints:**
- Use same logo everywhere
- Stick to your color palette
- Maintain consistent tone in descriptions
- Align with your social media branding
- Create a cohesive experience

## 🔧 Technical Details

### Default Values

If you don't set custom branding:
- **Logo:** Colored circle with store's first letter
- **Banner:** None (clean header)
- **Primary Color:** #3b82f6 (blue)
- **Accent Color:** #8b5cf6 (purple)
- **Tagline:** None
- **Description:** Falls back to application info

### Data Storage

Branding is stored in Firestore:
```
stores/[storeId]/branding {
  logo: string (URL),
  banner: string (URL),
  primaryColor: string (hex),
  accentColor: string (hex),
  description: string,
  tagline: string
}
```

### Performance

- Images are loaded on-demand
- Colors are inline styles (fast)
- No impact on page load speed
- Cached by browser

## 📋 Quick Start Checklist

For new sellers setting up branding:

```
☐ Upload logo to Imgur (or other host)
☐ Upload banner to Imgur (or other host)
☐ Copy image URLs
☐ Go to /admin/store-settings
☐ Paste logo URL
☐ Paste banner URL
☐ Choose primary color (main brand color)
☐ Choose accent color (complementary color)
☐ Write catchy tagline (under 60 chars)
☐ Write store description (under 500 chars)
☐ Click "Save Changes"
☐ Click "Preview Store" to see it live
☐ Share your store link with customers!
```

## 🎯 Examples

### Example 1: Tech Store

**Branding:**
- Primary Color: #0ea5e9 (cyan)
- Accent Color: #8b5cf6 (purple)
- Tagline: "Premium Tech Accessories"
- Description: "We curate the best tech accessories..."

### Example 2: Handmade Crafts

**Branding:**
- Primary Color: #f59e0b (amber)
- Accent Color: #10b981 (green)
- Tagline: "Handmade with Love ❤️"
- Description: "Each piece is crafted by hand..."

### Example 3: Eco-Friendly Fashion

**Branding:**
- Primary Color: #10b981 (green)
- Accent Color: #14b8a6 (teal)
- Tagline: "Sustainable Fashion for Everyone 🌿"
- Description: "We believe fashion should be sustainable..."

## 🆘 Troubleshooting

### "Image not showing"
- **Check URL:** Make sure it's a direct image link
- **Check format:** Use .jpg, .png, .webp
- **Check hosting:** Imgur, Google Drive set to public
- **Try another image:** Test with a different URL

### "Colors not updating"
- **Save first:** Click "Save Changes" button
- **Refresh page:** Hard refresh (Ctrl+Shift+R)
- **Check format:** Use hex format #RRGGBB

### "Changes not visible on store page"
- **Saved?** Make sure you clicked "Save Changes"
- **Refresh:** Clear browser cache and refresh
- **Check store:** Visit your store URL directly

### "Can't access store settings"
- **Verified?** Must be a verified seller
- **Signed in?** Make sure you're signed in
- **Role:** Check your role in Firebase (must be 'seller')

## 💡 Pro Tips

1. **Test on mobile:** Check how your branding looks on phones
2. **Get feedback:** Ask friends what they think
3. **Iterate:** Don't be afraid to update and improve
4. **Stay consistent:** Use same branding on social media
5. **Keep it simple:** Less is often more

## 🎨 Color Inspiration

Need help choosing colors? Try these tools:
- **Coolors.co** - Color palette generator
- **Adobe Color** - Color wheel and schemes
- **Material Design Colors** - Pre-made palettes

Or use these proven combinations:

| Style | Primary | Accent | Vibe |
|-------|---------|--------|------|
| **Professional** | #2563eb (blue) | #7c3aed (purple) | Trustworthy |
| **Eco-Friendly** | #10b981 (green) | #14b8a6 (teal) | Natural |
| **Luxury** | #1f2937 (dark gray) | #f59e0b (gold) | Premium |
| **Playful** | #ec4899 (pink) | #f59e0b (orange) | Fun |
| **Modern** | #06b6d4 (cyan) | #8b5cf6 (purple) | Tech |

---

**Ready to brand your store? Go to `/admin/store-settings` and make it yours!** 🎨✨

