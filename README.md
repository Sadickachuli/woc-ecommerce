# Wings of Change Ecommerce Platform

A modern, professional ecommerce website built for Wings of Change organization to showcase and sell innovative products from Ghana's brightest minds.

## Features

### Customer Features
- 🛍️ **Product Catalog**: Browse and search through innovative products
- 🔍 **Advanced Search**: Search by product name, description, and category
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🛒 **Shopping Cart**: Add products to cart (demo functionality)
- 📧 **Order Notifications**: Email notifications for new orders
- 🎨 **Modern UI**: Sleek, professional design with smooth animations

### Admin Features
- 🔐 **Secure Authentication**: Admin login with specified credentials
- 📊 **Dashboard Overview**: Revenue, orders, products, and pending orders statistics
- 📦 **Product Management**: Add, edit, and delete products
- 📋 **Order Management**: View and manage customer orders
- 📧 **Email Integration**: Automatic email notifications for new orders

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Notifications**: React Hot Toast
- **Email**: Nodemailer



## Project Structure

```
wings-of-change-ecommerce/
├── app/
│   ├── admin/                 # Admin panel pages
│   │   ├── page.tsx          # Admin login
│   │   └── dashboard/        # Admin dashboard
│   ├── api/                  # API routes
│   │   ├── orders/           # Order management API
│   │   └── products/         # Product management API
│   ├── components/           # Reusable components
│   │   ├── Header.tsx        # Navigation header
│   │   ├── Hero.tsx          # Hero section
│   │   ├── ProductGrid.tsx   # Product display grid
│   │   ├── ProductCard.tsx   # Individual product card
│   │   └── Footer.tsx        # Site footer
│   ├── lib/                  # Utility functions
│   │   ├── data.ts           # In-memory data store
│   │   └── email.ts          # Email functionality
│   ├── types/                # TypeScript definitions
│   │   └── index.ts          # Type definitions
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
├── public/                   # Static assets
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind configuration
├── next.config.js            # Next.js configuration
└── tsconfig.json            # TypeScript configuration
```



## License

This project is created for Wings of Change organization.

## Support

For support or questions, contact the development team or Wings of Change organization.

---

**Built with ❤️ for Wings of Change - Supporting Innovation in Ghana** 
