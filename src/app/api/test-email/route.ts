import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    // Log the environment variables (excluding password)
    console.log('Email Configuration:');
    console.log('Host:', process.env.EMAIL_SERVER_HOST);
    console.log('Port:', process.env.EMAIL_SERVER_PORT);
    console.log('User:', process.env.EMAIL_SERVER_USER);
    console.log('From:', process.env.EMAIL_FROM);

    // Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false // For development only
      }
    });

    // Verify the connection
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP connection verification failed:', verifyError);
      return NextResponse.json({ 
        success: false, 
        error: 'SMTP connection failed',
        details: verifyError instanceof Error ? verifyError.message : 'Unknown error'
      }, { status: 500 });
    }

    // Send test email
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: 'ridejunkies@gmail.com',
      subject: 'Test Email from Virtual Race',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from the Virtual Race application.</p>
        <p>If you received this, the email service is working correctly!</p>
        <p>Sent from: ${process.env.EMAIL_FROM}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Test email sent:', info.messageId);

    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId,
      from: process.env.EMAIL_FROM,
      to: 'ridejunkies@gmail.com'
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to send test email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 