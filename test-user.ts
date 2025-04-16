import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testUserOperations() {
  try {
    // Test user data
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: await bcrypt.hash('testpassword123', 10)
    };

    // Try to create a user
    console.log('Attempting to create test user...');
    const createdUser = await prisma.user.create({
      data: testUser,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });
    console.log('User created successfully:', createdUser);

    // Try to find the user
    console.log('\nAttempting to find the user...');
    const foundUser = await prisma.user.findUnique({
      where: { email: testUser.email },
      select: {
        id: true,
        name: true,
        email: true
      }
    });
    console.log('Found user:', foundUser);

    // Clean up - delete the test user
    console.log('\nCleaning up - deleting test user...');
    await prisma.user.delete({
      where: { email: testUser.email }
    });
    console.log('Test user deleted successfully');

  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testUserOperations(); 