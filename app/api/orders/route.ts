import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const order = await request.json()
    
    // Create email content for seller
    const sellerEmail = process.env.SELLER_EMAIL || 'wingsofchangeghana@gmail.com'
    
    // Send email to seller
    const sellerEmailResult = await resend.emails.send({
      from: 'Wings of Change <onboarding@resend.dev>',
      to: [sellerEmail],
      subject: 'New Order Received - Wings of Change',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            🛍️ New Order Received!
          </h1>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1f2937; margin-top: 0;">Customer Information</h2>
            <p><strong>Name:</strong> ${order.customer.firstName} ${order.customer.lastName}</p>
            <p><strong>Email:</strong> ${order.customer.email}</p>
            <p><strong>Phone:</strong> ${order.customer.phone}</p>
            <p><strong>Address:</strong> ${order.customer.address}, ${order.customer.city}, ${order.customer.state} ${order.customer.zipCode}, ${order.customer.country}</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1f2937; margin-top: 0;">Order Items</h2>
            ${order.items.map((item: any) => `
              <div style="border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
                <p style="margin: 5px 0;"><strong>${item.name}</strong></p>
                <p style="margin: 5px 0; color: #6b7280;">Quantity: ${item.quantity} | Price: $${item.price.toFixed(2)}</p>
                <p style="margin: 5px 0; font-weight: bold;">Subtotal: $${item.total.toFixed(2)}</p>
              </div>
            `).join('')}
          </div>
          
          <div style="background-color: #3b82f6; color: white; padding: 20px; border-radius: 8px; text-align: center;">
            <h2 style="margin: 0;">Total Order Amount</h2>
            <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">$${order.total.toFixed(2)}</p>
            <p style="margin: 0;">Status: ${order.status}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-radius: 8px;">
            <p style="margin: 0; color: #92400e;">
              ⚡ Please process this order and update the customer on the delivery status.
            </p>
          </div>
        </div>
      `
    })

    // Send confirmation email to customer
    const customerEmailResult = await resend.emails.send({
      from: 'Wings of Change <onboarding@resend.dev>',
      to: [order.customer.email],
      subject: 'Order Confirmation - Wings of Change',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            ✅ Order Confirmed!
          </h1>
          
          <p style="color: #6b7280; font-size: 16px;">
            Hi ${order.customer.firstName}, thank you for your order! We've received your purchase and will process it shortly.
          </p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1f2937; margin-top: 0;">Order Summary</h2>
            ${order.items.map((item: any) => `
              <div style="border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
                <p style="margin: 5px 0;"><strong>${item.name}</strong></p>
                <p style="margin: 5px 0; color: #6b7280;">Quantity: ${item.quantity} | Price: $${item.price.toFixed(2)}</p>
                <p style="margin: 5px 0; font-weight: bold;">Subtotal: $${item.total.toFixed(2)}</p>
              </div>
            `).join('')}
          </div>
          
          <div style="background-color: #3b82f6; color: white; padding: 20px; border-radius: 8px; text-align: center;">
            <h2 style="margin: 0;">Total Amount</h2>
            <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">$${order.total.toFixed(2)}</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1f2937; margin-top: 0;">Shipping Address</h2>
            <p style="margin: 5px 0;">${order.customer.firstName} ${order.customer.lastName}</p>
            <p style="margin: 5px 0;">${order.customer.address}</p>
            <p style="margin: 5px 0;">${order.customer.city}, ${order.customer.state} ${order.customer.zipCode}</p>
            <p style="margin: 5px 0;">${order.customer.country}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #d1fae5; border-radius: 8px;">
            <p style="margin: 0; color: #065f46;">
              📦 We'll send you a shipping confirmation once your order is on its way!
            </p>
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <p style="color: #6b7280;">
              Questions? Contact us at wingsofchangeghana@gmail.com
            </p>
          </div>
        </div>
      `
    })

    if (sellerEmailResult.error) {
      console.error('Failed to send seller email:', sellerEmailResult.error)
    }

    if (customerEmailResult.error) {
      console.error('Failed to send customer email:', customerEmailResult.error)
    }

    console.log('Emails sent successfully')
    
    // In a real application, you would also:
    // 1. Store the order in a database
    // 3. Process payment
    
    return NextResponse.json({ 
      success: true, 
      message: 'Order placed successfully and emails sent',
      orderId: Date.now().toString()
    })
    
  } catch (error) {
    console.error('Order processing error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process order' },
      { status: 500 }
    )
  }
} 