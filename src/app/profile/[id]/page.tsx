import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ProfileEditor } from '@/components/profile/ProfileEditor';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface ProfilePageProps {
  params: {
    id: string;
  };
}

interface RaceParticipant {
  id: string;
  joinedAt: Date;
  race: {
    id: string;
    name: string;
  };
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  raceParticipants: RaceParticipant[];
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  try {
    const session = await getServerSession(authOptions);
    const isOwnProfile = session?.user?.id === params.id;

    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
      include: {
        raceParticipants: {
          include: {
            race: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            joinedAt: 'desc',
          },
        },
      },
    }) as User | null;

    if (!user) {
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {isOwnProfile ? (
            <ProfileEditor user={user} />
          ) : (
            <div className="flex items-center gap-6 mb-8">
              <div className="relative w-24 h-24 rounded-full overflow-hidden">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || 'User profile'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-4xl text-gray-500">
                      {user.name?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user.name || 'Anonymous User'}</h1>
                <p className="text-gray-600">{user.email || 'No email provided'}</p>
              </div>
            </div>
          )}

          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold">Race History</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.raceParticipants.map((participant: RaceParticipant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{participant.race.name}</h3>
                      <p className="text-sm text-gray-600">
                        Joined on {new Date(participant.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Link href={`/races/${participant.race.id}`}>
                      <Button variant="secondary">View Race</Button>
                    </Link>
                  </div>
                ))}
                {user.raceParticipants.length === 0 && (
                  <p className="text-gray-600 text-center py-4">
                    No races joined yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw new Error('Failed to load profile');
  }
} 