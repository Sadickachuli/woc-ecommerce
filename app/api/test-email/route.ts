import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET() {
  try {
    // Check if API key exists
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        error: 'RESEND_API_KEY not configured',
        hint: 'Add it to Vercel environment variables and redeploy',
        config: {
          hasApiKey: false,
          fromDomain: process.env.RESEND_FROM_DOMAIN || 'NOT SET',
          adminEmail: process.env.ADMIN_EMAIL || 'NOT SET',
          appUrl: process.env.NEXT_PUBLIC_APP_URL || 'NOT SET',
        }
      }, { status: 500 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    
    const fromEmail = process.env.RESEND_FROM_DOMAIN 
      ? `test@${process.env.RESEND_FROM_DOMAIN}`
      : 'onboarding@resend.dev'
    
    const toEmail = process.env.ADMIN_EMAIL || 'xentofwocghana@gmail.com'

    console.log('📧 Sending test email...')
    console.log('From:', fromEmail)
    console.log('To:', toEmail)

    const result = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: '🧪 Test Email from Vercel',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">✅ Email is Working!</h1>
            </div>
            <div style="padding: 30px;">
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                <strong>Success!</strong> This test email was sent from your Vercel deployment.
              </p>
              <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
                <h3 style="color: #065f46; margin: 0 0 10px 0;">Configuration Details:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #047857;">
                  <li>From: ${fromEmail}</li>
                  <li>To: ${toEmail}</li>
                  <li>Domain: ${process.env.RESEND_FROM_DOMAIN || 'using default'}</li>
                  <li>Environment: Production</li>
                </ul>
              </div>
              <p style="font-size: 14px; color: #666; margin-top: 20px;">
                If you can see this email, your email configuration is working correctly!
              </p>
              <p style="font-size: 14px; color: #666;">
                <strong>⚠️ Note:</strong> Check your spam/junk folder if you don't see this email in your inbox.
              </p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #999; font-size: 12px;">Test Email - ${new Date().toISOString()}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
✅ Email is Working!

Success! This test email was sent from your Vercel deployment.

Configuration Details:
- From: ${fromEmail}
- To: ${toEmail}
- Domain: ${process.env.RESEND_FROM_DOMAIN || 'using default'}
- Environment: Production

If you can see this email, your email configuration is working correctly!

⚠️ Note: Check your spam/junk folder if you don't see this email in your inbox.

Test Email - ${new Date().toISOString()}
      `,
    })

    console.log('✅ Test email sent successfully:', result)

    return NextResponse.json({
      success: true,
      message: '✅ Email sent successfully! Check your inbox (and spam folder)',
      emailId: result.id,
      sentTo: toEmail,
      sentFrom: fromEmail,
      config: {
        hasApiKey: true,
        apiKeyPrefix: process.env.RESEND_API_KEY.substring(0, 8) + '...',
        fromDomain: process.env.RESEND_FROM_DOMAIN || 'NOT SET',
        adminEmail: process.env.ADMIN_EMAIL || 'NOT SET',
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'NOT SET',
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Test email failed:', error)
    
    return NextResponse.json({
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      config: {
        hasApiKey: !!process.env.RESEND_API_KEY,
        apiKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 8) + '...' || 'NOT SET',
        fromDomain: process.env.RESEND_FROM_DOMAIN || 'NOT SET',
        adminEmail: process.env.ADMIN_EMAIL || 'NOT SET',
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'NOT SET',
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

