import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // First, create a test user if it doesn't exist
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'test123', // In a real app, this should be hashed
        profileImage: 'https://ui-avatars.com/api/?name=Test+User',
      },
    });

    // Create a test race
    const race = await prisma.race.create({
      data: {
        name: 'Test Marathon',
        description: 'A test marathon for development purposes',
        distance: 42.2,
        startDate: new Date('2024-05-01'),
        endDate: new Date('2024-05-01'),
        imageUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571',
        userId: user.id,
        checkpoints: {
          create: [
            {
              name: 'Start Line',
              description: 'The beginning of the race',
              distance: 0,
              coordinates: [41.8781, -87.6298], // Chicago coordinates
            },
            {
              name: 'Halfway Point',
              description: 'You\'re halfway there!',
              distance: 21.1,
              coordinates: [41.8781, -87.6298],
            },
            {
              name: 'Finish Line',
              description: 'The end of the race',
              distance: 42.2,
              coordinates: [41.8781, -87.6298],
            },
          ],
        },
      },
      include: {
        user: true,
        checkpoints: true,
      },
    });

    console.log('Test race created:', race);
  } catch (error) {
    console.error('Error creating test race:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 