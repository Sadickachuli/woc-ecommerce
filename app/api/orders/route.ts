import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createOrder, getAllOrders } from '../../../lib/db/operations'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  try {
    const orders = await getAllOrders()
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/orders - Creating new order')
    const body = await request.json()
    console.log('Order request body:', body)
    
    const { customer, items, total } = body

    // Validate required fields
    if (!customer?.name || !customer?.email || !customer?.address || !items?.length || !total) {
      console.log('Missing required fields:', { customer, items, total })
      return NextResponse.json(
        { error: 'Missing required fields', details: { customer, items, total } },
        { status: 400 }
      )
    }

    console.log('Order validation passed, creating order...')

    // Create order in database
    const order = await createOrder({
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        address: customer.address,
      },
      items: items.map((item: any) => ({
        productId: item.id,
        productName: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
      })),
      total: parseFloat(total),
    })

    console.log('Order creation result:', order)

    if (!order) {
      console.error('createOrder returned null/undefined')
      return NextResponse.json(
        { error: 'Failed to create order - database operation failed' },
        { status: 500 }
      )
    }

    console.log('Order created successfully:', order.id)

    // Send email notifications
    const sellerEmail = process.env.SELLER_EMAIL || 'wingsofchangeghana@gmail.com'

    try {
      // Email to seller
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: sellerEmail,
        subject: `New Order #${order.id} - Wings of Change`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Order Received!</h2>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> ${order.id}</p>
              <p><strong>Total:</strong> $${parseFloat(order.total).toFixed(2)}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Customer Information</h3>
              <p><strong>Name:</strong> ${customer.name}</p>
              <p><strong>Email:</strong> ${customer.email}</p>
              ${customer.phone ? `<p><strong>Phone:</strong> ${customer.phone}</p>` : ''}
              <p><strong>Address:</strong> ${customer.address}</p>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Items Ordered</h3>
              ${items.map((item: any) => `
                <div style="border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
                  <p><strong>${item.name}</strong></p>
                  <p>Price: $${parseFloat(item.price).toFixed(2)} × ${item.quantity} = $${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                </div>
              `).join('')}
            </div>
            
            <p>Please process this order and contact the customer if needed.</p>
            <p>Best regards,<br>Wings of Change E-commerce System</p>
          </div>
        `,
      })

      // Email to customer
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: customer.email,
        subject: `Order Confirmation #${order.id} - Wings of Change`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Thank you for your order!</h2>
            <p>Dear ${customer.name},</p>
            <p>We've received your order and will process it shortly. Here are your order details:</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Order Summary</h3>
              <p><strong>Order ID:</strong> ${order.id}</p>
              <p><strong>Total:</strong> $${parseFloat(order.total).toFixed(2)}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Items Ordered</h3>
              ${items.map((item: any) => `
                <div style="border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
                  <p><strong>${item.name}</strong></p>
                  <p>Price: $${parseFloat(item.price).toFixed(2)} × ${item.quantity} = $${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                </div>
              `).join('')}
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Shipping Address</h3>
              <p>${customer.address}</p>
            </div>
            
            <p>We'll send you updates about your order status. If you have any questions, please contact us:</p>
            <p>📧 Email: wingsofchangeghana@gmail.com<br>
               📞 Phone: +233 55 609 0269</p>
            
            <p>Thank you for supporting Wings of Change!</p>
            <p>Best regards,<br>Wings of Change Team</p>
          </div>
        `,
      })

      console.log('Order emails sent successfully')
    } catch (emailError) {
      console.error('Failed to send order emails:', emailError)
      // Don't fail the order creation if email fails
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order - full error:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json(
      { error: 'Failed to create order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}