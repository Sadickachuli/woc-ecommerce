import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { updateStoreStatus, getStore, updateUserRole } from '@/lib/firebase/firestore'

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
        console.log('Resend API key not configured, skipping email')
      } else {
        const fromEmail = process.env.RESEND_FROM_DOMAIN 
          ? `noreply@${process.env.RESEND_FROM_DOMAIN}`
          : 'onboarding@resend.dev'
        
        await resend.emails.send({
          from: fromEmail,
          to: store.contactEmail,
          subject: 'Your Store has been Verified! 🎉',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Store Verified</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
                <h1 style="color: #28a745; margin-bottom: 20px;">🎉 Congratulations!</h1>
                
                <p style="font-size: 16px; margin-bottom: 15px;">
                  Great news! Your store <strong>${store.storeName}</strong> has been verified and approved.
                </p>
                
                <p style="font-size: 16px; margin-bottom: 15px;">
                  You can now:
                </p>
                
                <ul style="font-size: 16px; margin-bottom: 20px;">
                  <li>Log in to your seller dashboard</li>
                  <li>Start uploading products</li>
                  <li>Manage your inventory</li>
                  <li>Process orders from customers</li>
                </ul>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/dashboard" 
                     style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                    Go to Dashboard
                  </a>
                </div>
                
                <p style="font-size: 14px; color: #666; margin-top: 30px;">
                  If you have any questions, please don't hesitate to reach out to our support team.
                </p>
                
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                
                <p style="font-size: 12px; color: #999; text-align: center;">
                  This email was sent to ${store.contactEmail} regarding your seller application.
                </p>
              </div>
            </body>
          </html>
        `,
        })

        console.log(`Verification email sent to ${store.contactEmail}`)
      }
    } catch (emailError) {
      console.error('Error sending verification email:', emailError)
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

