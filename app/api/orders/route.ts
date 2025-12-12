import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { 
  createOrder as createOrderFirestore, 
  getAllOrders,
  getStore,
  getProduct,
  getUser
} from '@/lib/firebase/firestore'
import { formatPrice } from '@/lib/currencies'

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

    // Get store IDs from products and include currency
    const itemsWithStoreId = await Promise.all(
      items.map(async (item: any) => {
        const productId = item.productId || item.id
        const product = await getProduct(productId)
        
        // Get store to fetch currency
        let currency = 'USD'
        if (product?.storeId) {
          const store = await getStore(product.storeId)
          currency = store?.currency || 'USD'
        }
        
        return {
          productId,
          storeId: product?.storeId || 'unknown',
        productName: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
          currency,
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
      console.warn('⚠️ Skipping all email notifications (seller, admin, customer)')
      // Return success since order was created, just no emails sent
      return NextResponse.json(order, { status: 201 })
    }

    try {
      // Build all email promises to send in parallel
      console.log(`📬 Preparing to send emails to ${storeIds.length} store(s) in parallel`)
      const emailPromises: Promise<any>[] = []
      const emailLabels: string[] = [] // Track which email is which
      
      // Prepare seller and admin emails for each store
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

        console.log(`📧 Queuing email to seller: ${sellerEmail} for store: ${store.storeName}`)

        const storeItems = itemsWithStoreId.filter(item => item.storeId === storeId)
        const storeCurrency = storeItems[0]?.currency || 'USD'
        const storeTotal = storeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

        // Email to store owner
        const fromEmail = process.env.RESEND_FROM_DOMAIN 
          ? `orders@${process.env.RESEND_FROM_DOMAIN}`
          : 'onboarding@resend.dev'
        
        const replyTo = process.env.ADMIN_EMAIL || 'xentofwocghana@gmail.com'
        
      // Add seller email promise to array (don't await yet)
      emailLabels.push(`Seller: ${store.storeName} (${sellerEmail})`)
      emailPromises.push(resend.emails.send({
          from: `${store.storeName} Orders <${fromEmail}>`,
          replyTo: replyTo,
        to: sellerEmail,
          subject: `🛍️ New Order #${order.id} - ${store.storeName}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎉 New Order!</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">${store.storeName}</p>
                </div>
                
                <!-- Content -->
                <div style="padding: 30px;">
                  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
                    <h2 style="color: #333; margin: 0 0 15px 0; font-size: 20px;">Order Details</h2>
                    <p style="margin: 8px 0; color: #555;"><strong>Order ID:</strong> #${order.id}</p>
                    <p style="margin: 8px 0; color: #555;"><strong>Your Store Total:</strong> <span style="color: #667eea; font-size: 18px; font-weight: bold;">${formatPrice(storeTotal, storeCurrency)}</span></p>
                    <p style="margin: 8px 0; color: #555;"><strong>Status:</strong> <span style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; font-size: 12px;">PENDING</span></p>
            </div>
            
                  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">👤 Customer Information</h2>
                    <p style="margin: 8px 0; color: #555;"><strong>Name:</strong> ${customerName}</p>
                    <p style="margin: 8px 0; color: #555;"><strong>Email:</strong> <a href="mailto:${customer.email}" style="color: #667eea;">${customer.email}</a></p>
                    ${customer.phone ? `<p style="margin: 8px 0; color: #555;"><strong>Phone:</strong> ${customer.phone}</p>` : ''}
                    <p style="margin: 8px 0; color: #555;"><strong>Address:</strong> ${customerAddress}</p>
            </div>
            
                  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">📦 Items from Your Store</h2>
                    ${storeItems.map((item: any) => `
                      <div style="border-bottom: 1px solid #e5e7eb; padding: 12px 0;">
                        <p style="margin: 0 0 8px 0; color: #333; font-weight: bold;">${item.productName}</p>
                        <p style="margin: 0; color: #666; font-size: 14px;">
                          ${formatPrice(item.price, item.currency)} × ${item.quantity} = <strong>${formatPrice(item.price * item.quantity, item.currency)}</strong>
                        </p>
                </div>
              `).join('')}
            </div>
            
                  <div style="background: #e0e7ff; padding: 15px; border-radius: 8px; margin-top: 20px;">
                    <p style="margin: 0; color: #4338ca; font-size: 14px;">
                      ℹ️ <strong>Next Steps:</strong> Please process this order and contact the customer if needed.
                    </p>
                  </div>
                </div>
                
                <!-- Footer -->
                <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Best regards,</p>
                  <p style="margin: 0; color: #333; font-weight: bold;">E-commerce Platform</p>
                </div>
          </div>
            </body>
            </html>
          `,
          text: `
New Order for ${store.storeName}!

Order Details:
- Order ID: #${order.id}
- Your Store Total: ${formatPrice(storeTotal, storeCurrency)}
- Status: pending

Customer Information:
- Name: ${customerName}
- Email: ${customer.email}
${customer.phone ? `- Phone: ${customer.phone}` : ''}
- Address: ${customerAddress}

Items from Your Store:
${storeItems.map((item: any) => `- ${item.productName}: ${formatPrice(item.price, item.currency)} × ${item.quantity} = ${formatPrice(item.price * item.quantity, item.currency)}`).join('\n')}

Please process this order and contact the customer if needed.

Best regards,
E-commerce Platform
          `,
        }))
      }

      // Prepare admin email only (NO CUSTOMER EMAIL)
      const adminEmail = process.env.ADMIN_EMAIL || 'xentofwocghana@gmail.com'
      
      // Check if order has mixed currencies
      const orderCurrencies = [...new Set(itemsWithStoreId.map(item => item.currency))]
      const hasMixedCurrencies = orderCurrencies.length > 1
      const mainCurrency = orderCurrencies[0] || 'USD'

      console.log(`📧 Queuing order notification to admin: ${adminEmail}`)
      const adminFromEmail = process.env.RESEND_FROM_DOMAIN 
        ? `orders@${process.env.RESEND_FROM_DOMAIN}`
        : 'onboarding@resend.dev'
      
      // Send order notification to ADMIN ONLY (NO CUSTOMER EMAIL)
      emailLabels.push(`Admin: ${adminEmail}`)
      emailPromises.push(resend.emails.send({
        from: `Platform Orders <${adminFromEmail}>`,
        to: adminEmail,
        subject: `📦 New Order #${order.id} - ${storeIds.length} Store(s)`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">✅ Order Confirmed!</h1>
                <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Thank you for your purchase</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 30px;">
                <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear <strong>${customerName}</strong>,</p>
                <p style="color: #555; font-size: 15px; line-height: 1.6;">We've received your order and our sellers will process it shortly. Here are your order details:</p>
                
                <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                  <h2 style="color: #333; margin: 0 0 15px 0; font-size: 20px;">Order Summary</h2>
                  <p style="margin: 8px 0; color: #555;"><strong>Order ID:</strong> #${order.id}</p>
                  <p style="margin: 8px 0; color: #555;"><strong>Total:</strong> <span style="color: #059669; font-size: 18px; font-weight: bold;">${hasMixedCurrencies ? 'See items below' : formatPrice(parseFloat(total), mainCurrency)}</span></p>
                  <p style="margin: 8px 0; color: #555;"><strong>Status:</strong> <span style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; font-size: 12px;">PROCESSING</span></p>
            </div>
            
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">📦 Items Ordered</h2>
                  ${itemsWithStoreId.map((item: any) => `
                    <div style="border-bottom: 1px solid #e5e7eb; padding: 12px 0;">
                      <p style="margin: 0 0 8px 0; color: #333; font-weight: bold;">${item.productName}</p>
                      <p style="margin: 0; color: #666; font-size: 14px;">
                        ${formatPrice(item.price, item.currency)} × ${item.quantity} = <strong>${formatPrice(item.price * item.quantity, item.currency)}</strong>
                      </p>
                </div>
              `).join('')}
            </div>
            
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">📍 Shipping Address</h2>
                  <p style="margin: 0; color: #555; line-height: 1.6;">${customerAddress}</p>
            </div>
            
                <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-top: 20px;">
                  <p style="margin: 0; color: #1e40af; font-size: 14px;">
                    💡 <strong>What's Next?</strong> We'll send you updates about your order status. If you have any questions, please reply to this email.
                  </p>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 10px 0; color: #333; font-weight: bold; font-size: 16px;">New Order Notification</p>
                <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">E-commerce Platform</p>
                <p style="margin: 0; color: #999; font-size: 12px;">Admin Notification</p>
              </div>
          </div>
          </body>
          </html>
        `,
        text: `
Order Confirmation

Dear ${customerName},

We've received your order and our sellers will process it shortly.

Order Summary:
- Order ID: #${order.id}
- Total: ${hasMixedCurrencies ? 'See items below' : formatPrice(parseFloat(total), mainCurrency)}
- Status: Processing

Items Ordered:
${itemsWithStoreId.map((item: any) => `- ${item.productName}: ${formatPrice(item.price, item.currency)} × ${item.quantity} = ${formatPrice(item.price * item.quantity, item.currency)}`).join('\n')}

Shipping Address:
${customerAddress}

What's Next?
We'll send you updates about your order status. If you have any questions, please reply to this email.

Thank you for your purchase!

Best regards,
E-commerce Platform
(Admin Notification)
        `,
      }))

      // Send all emails in parallel (no batching, no delays)
      console.log(`🚀 Sending ${emailPromises.length} emails in parallel...`)
      console.log(`📧 Recipients:`)
      emailLabels.forEach(label => console.log(`   - ${label}`))
      
      const startTime = Date.now()
      
      // Send ALL emails at once using Promise.allSettled
      // If one fails, others still proceed
      const results = await Promise.allSettled(emailPromises)
      
      const endTime = Date.now()
      const duration = ((endTime - startTime) / 1000).toFixed(2)
      
      // Count successes and failures
      const successCount = results.filter(r => r.status === 'fulfilled').length
      const failureCount = results.filter(r => r.status === 'rejected').length
      
      console.log(`\n📊 Email Results (${duration}s):`)
      
      // Log each email result with detailed info
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          console.log(`✅ ${emailLabels[index]}`)
          // Check if Resend returned an error within a successful promise
          const response = result.value
          if (response?.error) {
            console.warn(`   ⚠️ Resend Error: ${response.error.message || JSON.stringify(response.error)}`)
          } else if (response?.data?.id) {
            console.log(`   📧 Email ID: ${response.data.id}`)
          }
        } else {
          console.error(`❌ ${emailLabels[index]}`)
          console.error(`   Error: ${result.reason}`)
        }
      })
      
      // Summary
      if (failureCount > 0) {
        console.warn(`\n⚠️ SUMMARY: ${successCount}/${emailPromises.length} emails sent (${failureCount} failed)`)
        console.warn(`⚠️ Some emails may have been rate limited. Consider upgrading to Resend Pro.`)
      } else {
        console.log(`\n✅ SUCCESS: All ${emailPromises.length} emails sent in ${duration}s!`)
      }
      
      console.log(`📧 Total: ${storeIds.length} seller(s) + 1 admin = ${emailPromises.length} emails (NO CUSTOMER EMAIL)`)
      
      // If admin email failed, log a critical warning
      const adminFailed = results.some((result, index) => 
        result.status === 'rejected' && emailLabels[index].includes('Admin')
      )
      
      if (adminFailed) {
        console.error(`🚨 CRITICAL: Admin email failed! Admin will not be notified.`)
      }
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
