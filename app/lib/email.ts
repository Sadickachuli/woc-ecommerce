import nodemailer from 'nodemailer'
import { Order } from '../types'

// Email configuration (in production, use environment variables)
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'wingsofchangeghana@gmail.com',
    pass: 'woc0551401709', // In production, use app-specific password
  },
})

export const sendOrderNotification = async (order: Order) => {
  const orderItems = order.items.map(item => 
    `${item.productName} - Qty: ${item.quantity} - $${item.total.toFixed(2)}`
  ).join('\n')

  const emailContent = `
    New Order Received!
    
    Order ID: ${order.id}
    Customer: ${order.customerName}
    Email: ${order.customerEmail}
    Phone: ${order.customerPhone}
    Address: ${order.customerAddress}
    
    Items:
    ${orderItems}
    
    Total: $${order.total.toFixed(2)}
    
    Order Date: ${order.createdAt.toLocaleDateString()}
  `

  try {
    await transporter.sendMail({
      from: 'wingsofchangeghana@gmail.com',
      to: 'wingsofchangeghana@gmail.com',
      subject: `New Order - ${order.id}`,
      text: emailContent,
    })

    // Send confirmation email to customer
    const customerEmailContent = `
      Thank you for your order!
      
      Order ID: ${order.id}
      Total: $${order.total.toFixed(2)}
      
      We will process your order and contact you soon.
      
      Best regards,
      Wings of Change Team
    `

    await transporter.sendMail({
      from: 'wingsofchangeghana@gmail.com',
      to: order.customerEmail,
      subject: 'Order Confirmation - Wings of Change',
      text: customerEmailContent,
    })

    return true
  } catch (error) {
    console.error('Email sending failed:', error)
    return false
  }
} 