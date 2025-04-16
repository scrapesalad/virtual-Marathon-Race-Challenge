import { POST } from '../route';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data: unknown) => ({
      json: () => Promise.resolve(data),
    })),
  },
}));

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

describe('Login API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return error when email is missing', async () => {
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password: 'password123' }),
    });

    const response = await POST(request);
    const data = await response.json();
    expect(data).toEqual({
      error: 'Email and password are required',
    });
  });

  it('should return error when password is missing', async () => {
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
    });

    const response = await POST(request);
    const data = await response.json();
    expect(data).toEqual({
      error: 'Email and password are required',
    });
  });

  it('should return error for invalid credentials', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword',
      }),
    });

    const response = await POST(request);
    const data = await response.json();
    expect(data).toEqual({
      error: 'Invalid credentials',
    });
  });

  it('should return success for valid credentials', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      password: '$2b$10$hashedpassword',
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();
    expect(data).toHaveProperty('user');
    expect(data.user).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
    });
  });
}); 