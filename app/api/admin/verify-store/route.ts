import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { updateStoreStatus, getStore, updateUserRole, getUser } from '@/lib/firebase/firestore'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const { storeId } = await request.json()

    if (!storeId) {
      return NextResponse.json(
        { error: 'Store ID is required' },
        { status: 400 }
      )
    }

    // Note: In a production app, you should verify the user is an admin here
    // by checking the Authorization header and validating the Firebase token
    // For now, we're relying on the client-side check

    // Get store details
    const store = await getStore(storeId)

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    // Update store status to verified
    await updateStoreStatus(storeId, 'verified')

    // Update user role to seller
    await updateUserRole(store.ownerUid, 'seller', storeId)

    // Send verification email using Resend
    try {
      // Skip email if no API key configured
      if (!resend) {
        console.log('⚠️ Resend API key not configured, skipping verification email')
      } else {
        // Get the seller's actual Google account email
        const seller = await getUser(store.ownerUid)
        const sellerEmail = seller?.email || store.contactEmail
        
        const fromEmail = process.env.RESEND_FROM_DOMAIN 
          ? `noreply@${process.env.RESEND_FROM_DOMAIN}`
          : 'onboarding@resend.dev'
        
        const adminEmail = process.env.ADMIN_EMAIL || 'xentofwocghana@gmail.com'
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const siteName = process.env.RESEND_FROM_DOMAIN 
          ? process.env.RESEND_FROM_DOMAIN.replace(/\.[^.]+$/, '').split('.').pop()?.toUpperCase()
          : 'E-commerce Platform'
        
        console.log(`📧 Sending verification email to: ${sellerEmail} for store: ${store.storeName}`)
        
        await resend.emails.send({
          from: `${siteName} <${fromEmail}>`,
          replyTo: adminEmail,
          to: sellerEmail,
          subject: '🎉 Your Store has been Verified!',
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
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 32px;">🎉 Congratulations!</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 18px; opacity: 0.95;">Your store is now live!</p>
                </div>
                
                <!-- Content -->
                <div style="padding: 40px 30px;">
                  <div style="background: #d1fae5; padding: 25px; border-radius: 12px; margin-bottom: 30px; border-left: 5px solid #10b981;">
                    <h2 style="color: #065f46; margin: 0 0 15px 0; font-size: 22px;">✅ Store Verified</h2>
                    <p style="margin: 0; color: #047857; font-size: 16px; line-height: 1.6;">
                      Great news! Your store <strong style="color: #065f46;">${store.storeName}</strong> has been verified and approved by our team.
                    </p>
                  </div>
                  
                  <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
                    <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">🚀 What You Can Do Now:</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #555; line-height: 1.8;">
                      <li><strong>Access your seller dashboard</strong></li>
                      <li><strong>Start uploading products</strong> to your store</li>
                      <li><strong>Customize your store</strong> branding and colors</li>
                      <li><strong>Manage your inventory</strong> and pricing</li>
                      <li><strong>Process customer orders</strong> and fulfill them</li>
                      <li><strong>Track your sales</strong> and performance</li>
                    </ul>
                  </div>
                  
                  <!-- CTA Button -->
                  <div style="text-align: center; margin: 35px 0;">
                    <a href="${appUrl}/admin/dashboard" 
                       style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                      Go to Your Dashboard →
                    </a>
                  </div>
                  
                  <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                      <strong>⚠️ Important:</strong> This email may have landed in your spam or junk folder. Please add <strong>${fromEmail}</strong> to your contacts to ensure you receive all future notifications about your orders and store updates.
                    </p>
                  </div>
                  
                  <div style="background: #e0e7ff; padding: 20px; border-radius: 8px; margin-top: 25px;">
                    <p style="margin: 0 0 10px 0; color: #3730a3; font-size: 15px; line-height: 1.6;">
                      <strong>💡 Quick Tips for Success:</strong>
                    </p>
                    <ul style="margin: 0; padding-left: 20px; color: #4338ca; font-size: 14px; line-height: 1.7;">
                      <li>Add high-quality product images</li>
                      <li>Write detailed product descriptions</li>
                      <li>Set competitive prices</li>
                      <li>Respond to customer inquiries promptly</li>
                      <li>Keep your inventory updated</li>
                    </ul>
                  </div>
                  
                  <div style="margin-top: 30px; padding-top: 25px; border-top: 2px solid #e5e7eb;">
                    <p style="margin: 0 0 10px 0; color: #555; font-size: 15px;">
                      Need help getting started? Our support team is here for you!
                    </p>
                    <p style="margin: 0; color: #666; font-size: 14px;">
                      Reply to this email or contact us at <a href="mailto:${adminEmail}" style="color: #10b981; text-decoration: none;">${adminEmail}</a>
                    </p>
                  </div>
                </div>
                
                <!-- Footer -->
                <div style="background: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px 0; color: #333; font-weight: bold; font-size: 16px;">
                    Welcome to ${siteName}! 🎊
                  </p>
                  <p style="margin: 0 0 5px 0; color: #666; font-size: 13px;">
                    This email was sent to ${sellerEmail}
                  </p>
                  <p style="margin: 0; color: #999; font-size: 12px;">
                    Regarding your seller application for ${store.storeName}
                  </p>
                </div>
              </div>
            </body>
            </html>
          `,
          text: `
🎉 Congratulations! Your Store has been Verified!

Great news! Your store "${store.storeName}" has been verified and approved by our team.

What You Can Do Now:
- Access your seller dashboard
- Start uploading products to your store
- Customize your store branding and colors
- Manage your inventory and pricing
- Process customer orders and fulfill them
- Track your sales and performance

Get Started:
Visit your dashboard: ${appUrl}/admin/dashboard

⚠️ IMPORTANT - Check Your Spam Folder:
This email may have landed in your spam or junk folder. Please add ${fromEmail} to your contacts to ensure you receive all future notifications about your orders and store updates.

Quick Tips for Success:
- Add high-quality product images
- Write detailed product descriptions
- Set competitive prices
- Respond to customer inquiries promptly
- Keep your inventory updated

Need Help?
Our support team is here for you! Reply to this email or contact us at ${adminEmail}

Welcome to ${siteName}!

---
This email was sent to ${sellerEmail} regarding your seller application for ${store.storeName}
          `,
        })

        console.log(`✅ Verification email sent successfully to: ${sellerEmail}`)
      }
    } catch (emailError) {
      console.error('❌ Failed to send verification email:', emailError)
      if (emailError instanceof Error) {
        console.error('Email error details:', emailError.message)
      }
      // Don't fail the entire request if email fails
      // The store is already verified
    }

    return NextResponse.json({ 
      success: true,
      message: 'Store verified successfully',
      store: {
        id: storeId,
        storeName: store.storeName,
        status: 'verified'
      }
    })

  } catch (error) {
    console.error('Error verifying store:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to verify store', details: errorMessage },
      { status: 500 }
    )
  }
}

