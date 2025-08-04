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

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wings-of-change-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Admin Access

### Login Credentials
- **Email**: wingsofchangeghana@gmail.com
- **Password**: woc0551401709

### Access Admin Panel
1. Go to `/admin` in your browser
2. Enter the credentials above
3. Access the full admin dashboard

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

## Features in Detail

### Ecommerce Frontend
- **Homepage**: Hero section with compelling messaging about supporting Ghana's innovators
- **Product Grid**: Responsive grid layout with search and filter functionality
- **Product Cards**: Individual product display with add to cart functionality
- **Navigation**: Mobile-responsive navigation with cart indicator

### Admin Dashboard
- **Overview Tab**: Key metrics and recent orders
- **Products Tab**: Full CRUD operations for product management
- **Orders Tab**: Order tracking and management
- **Authentication**: Secure admin login system

### Email Notifications
- **Order Confirmation**: Sent to customers when orders are placed
- **Admin Notification**: Sent to admin email for new orders
- **Email Content**: Includes order details, customer information, and totals

## Sample Data

The application comes with sample products showcasing various categories:
- **Technology**: Solar chargers and innovative gadgets
- **Beauty**: Organic shea butter and natural products
- **Fashion**: Recycled materials and sustainable fashion
- **Jewelry**: Traditional bead jewelry
- **Food**: Local honey and natural products
- **Lifestyle**: Eco-friendly products like bamboo bottles

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features
1. Create new components in `app/components/`
2. Add API routes in `app/api/`
3. Update types in `app/types/index.ts`
4. Add data functions in `app/lib/data.ts`

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
- **Netlify**: Compatible with Next.js
- **Railway**: Easy deployment with database support
- **DigitalOcean**: App Platform deployment

## Environment Variables

For production, consider setting up these environment variables:
```env
# Email Configuration
EMAIL_USER=wingsofchangeghana@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=wingsofchangeghana@gmail.com

# Database (if migrating from in-memory)
DATABASE_URL=your-database-url

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=your-domain
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is created for Wings of Change organization.

## Support

For support or questions, contact the development team or Wings of Change organization.

---

**Built with ❤️ for Wings of Change - Supporting Innovation in Ghana** 