import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import nodemailer from 'nodemailer';
import { sendVerificationEmail } from '@/lib/email';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    console.log('Registration attempt:', { firstName, lastName, email: email.slice(0, 3) + '...' });

    // Test database connection first
    try {
      await prisma.$connect();
      console.log('Database connection successful');
    } catch (error) {
      console.error('Database connection error:', error);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    console.log('Checking for existing user with email:', email.slice(0, 3) + '...');
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    console.log('No existing user found, proceeding with registration');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Create user
    console.log('Creating new user with email:', email.slice(0, 3) + '...');
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        emailVerified: false,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Send verification email
    const emailSent = await sendVerificationEmail(email);
    if (!emailSent) {
      console.error('Failed to send verification email');
      // Don't fail the registration, just log the error
    }

    console.log('User created successfully:', user.id);
    return NextResponse.json({
      message: 'User created successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof PrismaClientKnownRequestError) {
      console.error('Database error details:', error);
    }
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 