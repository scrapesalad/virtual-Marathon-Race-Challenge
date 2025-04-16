import nodemailer from 'nodemailer';
import { generateToken } from './jwt';

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter verification failed:', error);
  } else {
    console.log('Email transporter is ready to send messages');
  }
});

export async function sendVerificationEmail(email: string) {
  try {
    console.log('Attempting to send verification email to:', email);
    console.log('Using SMTP host:', process.env.EMAIL_SERVER_HOST);
    console.log('Using sender email:', process.env.EMAIL_FROM);

    // Generate verification token
    const token = generateToken({ email, userId: 'verification' });
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
    
    console.log('Generated verification URL:', verificationUrl);

    // Send email
    const info = await transporter.sendMail({
      from: `"Virtual Race" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Verify your email for Virtual Race',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome to Virtual Race!</h1>
          <p style="color: #666;">Please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">If you did not create an account, please ignore this email.</p>
          <p style="color: #666; font-size: 14px;">Or copy and paste this link in your browser: ${verificationUrl}</p>
        </div>
      `,
    });

    console.log('Verification email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        code: (error as any).code,
      });
    }
    return false;
  }
} 