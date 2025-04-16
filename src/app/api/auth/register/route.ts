import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import nodemailer from 'nodemailer';
import { sendVerificationEmail } from '@/lib/email';

// Email validation regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    console.log('Registration attempt:', { name, email: email.slice(0, 3) + '...' });

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

    // Input validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
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
        name,
        email,
        password: hashedPassword,
        emailVerified: null,
      },
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(email);
    if (!emailSent) {
      console.error('Failed to send verification email');
      // Don't fail the registration, just log the error
    }

    console.log('User created successfully:', user.id);
    return NextResponse.json(
      { 
        message: 'User created successfully. Please check your email to verify your account.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof PrismaClientKnownRequestError) {
      console.error('Database error details:', error);
    }
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 