import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Send email to the business owner
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [process.env.SELLER_EMAIL || 'mustaphasadick705@gmail.com'],
      subject: `New Contact Form Message: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">New Contact Message</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0;">Wings of Change - Contact Form</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border-left: 4px solid #667eea;">
            <h2 style="color: #333; margin-top: 0;">Contact Details</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <div style="margin-bottom: 15px;">
                <strong style="color: #667eea;">Name:</strong> ${name}
              </div>
              <div style="margin-bottom: 15px;">
                <strong style="color: #667eea;">Email:</strong> ${email}
              </div>
              <div style="margin-bottom: 15px;">
                <strong style="color: #667eea;">Subject:</strong> ${subject}
              </div>
            </div>
            
            <h3 style="color: #333; margin: 25px 0 15px 0;">Message:</h3>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
              <p style="color: #555; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                This message was sent from the Wings of Change contact form.<br>
                Reply directly to this email to respond to ${name}.
              </p>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} Wings of Change. All rights reserved.
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Error sending contact email:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    // Send confirmation email to the customer
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [email],
      subject: 'Thank you for contacting Wings of Change',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Thank You!</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0;">Wings of Change</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${name},</h2>
            
            <p style="color: #555; line-height: 1.6; margin: 20px 0;">
              Thank you for reaching out to us! We've received your message about "<strong>${subject}</strong>" and we appreciate you taking the time to contact us.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin-top: 0;">What happens next?</h3>
              <ul style="color: #555; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Our team will review your message within 24 hours</li>
                <li style="margin-bottom: 8px;">We'll respond directly to your email: ${email}</li>
                <li style="margin-bottom: 8px;">For urgent matters, you can also call us at +1 (555) 123-4567</li>
              </ul>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin: 20px 0;">
              In the meantime, feel free to browse our <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products" style="color: #667eea; text-decoration: none;">product catalog</a> or learn more about our <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/about" style="color: #667eea; text-decoration: none;">mission</a>.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                Best regards,<br>
                The Wings of Change Team<br>
                <a href="mailto:mustaphasadick705@gmail.com" style="color: #667eea; text-decoration: none;">mustaphasadick705@gmail.com</a>
              </p>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} Wings of Change. All rights reserved.
            </p>
          </div>
        </div>
      `,
    })

    console.log('Contact form email sent successfully:', data)

    return NextResponse.json(
      { message: 'Contact form submitted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}