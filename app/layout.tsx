import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { CartProvider } from './contexts/CartContext'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Xent - Sustainable E-commerce',
  description: 'Discover sustainable and eco-friendly products that make a difference.',
  icons: {
    icon: '/xent-logo.png',
    shortcut: '/xent-logo.png',
    apple: '/xent-logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/xent-logo.png" type="image/png" />
      </head>
      <body className={inter.className}>
        <CartProvider>
          <Header />
          <main>
            {children}
          </main>
          <Footer />
          <Toaster position="top-right" />
        </CartProvider>
      </body>
    </html>
  )
} 