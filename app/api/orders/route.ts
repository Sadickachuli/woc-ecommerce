import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { 
  createOrder as createOrderFirestore, 
  getAllOrders,
  getStore,
  getProduct,
  getUser
} from '@/lib/firebase/firestore'

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
    const customerName = customer?.name || (customer?.firstName && customer?.lastName ? `${customer.firstName} ${customer.lastName}` : '')
    const customerAddress = customer?.address || `${customer?.city || ''}, ${customer?.state || ''}, ${customer?.zipCode || ''}, ${customer?.country || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '')
    
    if (!customerName || !customer?.email || !customerAddress || !items?.length || !total) {
      console.log('Missing required fields:', { customerName, email: customer?.email, customerAddress, items: items?.length, total })
      return NextResponse.json(
        { error: 'Missing required fields', details: { customerName, email: customer?.email, customerAddress, itemsCount: items?.length, total } },
        { status: 400 }
      )
    }

    console.log('Order validation passed, creating order...')

    // Get store IDs from products
    const itemsWithStoreId = await Promise.all(
      items.map(async (item: any) => {
        const productId = item.productId || item.id
        const product = await getProduct(productId)
        return {
          productId,
          storeId: product?.storeId || 'unknown',
          productName: item.name,
          price: parseFloat(item.price),
          quantity: item.quantity,
        }
      })
    )

    // Create order in Firestore
    const order = await createOrderFirestore({
      customerName,
      customerEmail: customer.email,
      customerPhone: customer.phone || '',
      customerAddress,
      items: itemsWithStoreId,
      total: parseFloat(total),
      status: 'pending',
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

    // Get unique store IDs and send notifications to each store owner
    const storeIds = [...new Set(itemsWithStoreId.map(item => item.storeId))]
    
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY not configured - emails will not be sent')
    }

    try {
      // Send emails to each store owner
      console.log(`📬 Preparing to send emails to ${storeIds.length} store(s)`)
      
      for (const storeId of storeIds) {
        if (storeId === 'unknown') continue

        const store = await getStore(storeId)
        if (!store) {
          console.log(`⚠️ Store not found for storeId: ${storeId}`)
          continue
        }

        // Get the actual user's email (from their Google account)
        const storeOwner = await getUser(store.ownerUid)
        const sellerEmail = storeOwner?.email || store.contactEmail

        console.log(`📧 Sending email to seller: ${sellerEmail} for store: ${store.storeName}`)

        const storeItems = itemsWithStoreId.filter(item => item.storeId === storeId)
        const storeTotal = storeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

        // Email to store owner
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: sellerEmail,
          subject: `New Order #${order.id} - ${store.storeName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">New Order for ${store.storeName}!</h2>
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Your Store Total:</strong> $${storeTotal.toFixed(2)}</p>
                <p><strong>Status:</strong> pending</p>
              </div>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> ${customerName}</p>
                <p><strong>Email:</strong> ${customer.email}</p>
                ${customer.phone ? `<p><strong>Phone:</strong> ${customer.phone}</p>` : ''}
                <p><strong>Address:</strong> ${customerAddress}</p>
              </div>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Items from Your Store</h3>
                ${storeItems.map((item: any) => `
                  <div style="border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
                    <p><strong>${item.productName}</strong></p>
                    <p>Price: $${item.price.toFixed(2)} × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                `).join('')}
              </div>
              
              <p>Please process this order and contact the customer if needed.</p>
              <p>Best regards,<br>E-commerce Platform</p>
            </div>
          `,
        })
      }

      // Send email to main admin
      const adminEmail = process.env.ADMIN_EMAIL || 'wingsofchangeghana@gmail.com'
      console.log(`📧 Sending admin notification to: ${adminEmail}`)
      
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: adminEmail,
        subject: `New Order #${order.id} - Platform Admin Notification`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Order Received!</h2>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> ${order.id}</p>
              <p><strong>Total:</strong> $${parseFloat(total).toFixed(2)}</p>
              <p><strong>Status:</strong> pending</p>
              <p><strong>Stores Involved:</strong> ${storeIds.length}</p>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Customer Information</h3>
              <p><strong>Name:</strong> ${customerName}</p>
              <p><strong>Email:</strong> ${customer.email}</p>
              ${customer.phone ? `<p><strong>Phone:</strong> ${customer.phone}</p>` : ''}
              <p><strong>Address:</strong> ${customerAddress}</p>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>All Items Ordered</h3>
              ${items.map((item: any) => `
                <div style="border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
                  <p><strong>${item.name}</strong></p>
                  <p>Price: $${parseFloat(item.price).toFixed(2)} × ${item.quantity} = $${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                </div>
              `).join('')}
            </div>
            
            <p>Individual store owners have been notified of their respective items.</p>
            <p>Best regards,<br>E-commerce System</p>
          </div>
        `,
      })

      // Email to customer
      console.log(`📧 Sending order confirmation to customer: ${customer.email}`)
      
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: customer.email,
        subject: `Order Confirmation #${order.id}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Thank you for your order!</h2>
            <p>Dear ${customerName},</p>
            <p>We've received your order and our sellers will process it shortly. Here are your order details:</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Order Summary</h3>
              <p><strong>Order ID:</strong> ${order.id}</p>
              <p><strong>Total:</strong> $${parseFloat(total).toFixed(2)}</p>
              <p><strong>Status:</strong> pending</p>
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
              <p>${customerAddress}</p>
            </div>
            
            <p>We'll send you updates about your order status. If you have any questions, please contact us.</p>
            
            <p>Thank you for your purchase!</p>
            <p>Best regards,<br>The E-commerce Team</p>
          </div>
        `,
      })

      console.log('✅ All order emails sent successfully!')
    } catch (emailError) {
      console.error('❌ Failed to send order emails:', emailError)
      if (emailError instanceof Error) {
        console.error('Email error message:', emailError.message)
      }
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
